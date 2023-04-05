const axios = require('axios');

async function getPlaceDetails(placeId) {
  try {
    // Ini mendapatkan data reviews, lng dan lat, serta photos
    const {data} = await axios({
      method : 'GET',
      url : `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=formatted_address,name,geometry,photos&key=${process.env.GOOGLE_MAPS_KEY}`,
      headers : {}
    })
    return data;
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getPlaceDetails};
