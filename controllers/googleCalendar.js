const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { User, GoogleCalendarToken } = require('../models');
const axios = require('axios');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist(UserId) {
  try {
    // const content = await fs.readFile(TOKEN_PATH);
    // const credentials = JSON.parse(content);
    const credentials = await GoogleCalendarToken.findOne({ where: { UserId } });
    console.log(credentials, "<<<< ini isi credential yang ditemukan di googlecalendartoken");
    if (!credentials) {
      throw { message: "Didn't find the token" };
    }
    // console.log('ini token user >>>', credentials);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client, UserId) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  // console.log( 'ini credential aplikasi >>>', keys);
  const key = keys.installed || keys.web;
  // const payload = JSON.stringify({
  //   type: 'authorized_user',
  //   client_id: key.client_id,
  //   client_secret: key.client_secret,
  //   refresh_token: client.credentials.refresh_token,
  // });
  const payload = {
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  };
  await GoogleCalendarToken.create({ ...payload, UserId });
  // await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize(UserId) {
  let client = await loadSavedCredentialsIfExist(UserId);
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client, UserId);
  }
  return client;
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

async function getTimeZone(lat, lng) {
  try {
    const timestamp = Math.floor((new Date()).getTime()/1000);
    const config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${timestamp}&key=${process.env.GOOGLE_MAPS_KEY}`,
      headers: {}
    };
    const response = await axios(config);
    return response.data.timeZoneId;
  } catch(err) {
    console.log(err);
  }
}

async function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  } else {
    return events;
  }
}

async function addEventToCalendar(input) {
  try {
    const auth = await authorize(input.UserId);
    const calendar = google.calendar({ version: 'v3', auth });
    const event = {
      summary: input.plan,
      location: input.address,
      description: `I'm going to have fun in ${input.destinationName}!`,
      start: {
        dateTime: input.start,
        timeZone: input.timeZone
      },
      end: {
        dateTime: input.end,
        timeZone: input.timeZone
      }
    };
    const result = calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event
    });
    return result;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function updateScheduleOnCalendar(input) {
  try {
    const auth = await authorize(input.UserId);
    const calendar = google.calendar({ version: 'v3', auth });
    const updateProps = {
      start: {
        dateTime: input.start
      },
      end: {
        dateTime: input.end
      }
    };
    const result = await calendar.events.patch({
      auth: auth,
      calendarId: 'primary',
      eventId: input.eventId,
      resource: updateProps
    });
    return result;
  } catch (err) {
    console.log(err);
    return;
  }

}

async function deleteEventFromCalendar(input) {
  try {
    const auth = await authorize(input.UserId);
    const calendar = google.calendar({ version: 'v3', auth });
    const result = await calendar.events.delete({
      calendarId: 'primary',
      eventId: input.eventId
    });
    return result;
  } catch (err) {
    console.log(err);
    return;
  }
}

async function getListEvents(UserId) {
  try {
    const auth = await authorize(UserId);
    const events = await listEvents(auth);
    return events;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = { getListEvents, addEventToCalendar, updateScheduleOnCalendar, deleteEventFromCalendar, getTimeZone };

// authorize().then(listEvents).catch(console.error);