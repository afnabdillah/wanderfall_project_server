const { Op } = require('sequelize');
const { Destination, Tag, Image, Review, Users, Profile, Schedule } = require('../models');
const { addEventToCalendar, updateScheduleOnCalendar, deleteEventFromCalendar, getTimeZone } = require('./googleCalendar');
const { getPlaceDetails } = require('./googlePlaces');

class DestinationController {

  static async destinations(req, res, next) {
    try {
      let {search, tag, page, size} = req.query;
      search = search ?? '';
      tag = tag ?? '';
      page = page ?? 1;
      size = size ?? 5;
      const {rows, count} = await Destination.findAndCountAll({
        where : {
          name : {
            [Op.iLike] : `%${search}%`
          }
        },
        include: [
          Image, 
          Review, 
          {
            model : Tag,
            where : {
              name : {
                [Op.iLike] : `%${tag}%`
              }
            }
          } 
        ],
        order: [['createdAt', 'DESC']],
        limit : size,
        offset : (page-1) * size,
        distinct : true
      });
      const destinations = rows;
      res.status(200).json({destinations, count});
    } catch (err) {
      next(err);
    }
  }

  static async destinationDetails(req, res, next) {
    try {
      const { destinationId } = req.params;
      const destinationDetails = await Destination.findOne({
        where: { id: destinationId },
        attributes : {
          exclude : ['createdAt', 'updatedAt']
        },
        include: [
          Image,
          {
            model: Review,
            attributes : {
              exclude : ['createdAt', 'updatedAt']
            },
            include: {
              model : Users,
              attributes : {
                exclude : ['createdAt', 'updatedAt', 'password']
              },
              include : {
                model : Profile,
                attributes : ['userPhoto']
              }
            }
          },
          Tag
        ]
      })
      if (!destinationDetails) {
        throw { name: 'NotFound' }
      }
      const placeDetails = await getPlaceDetails(destinationDetails.googlePlaceId);
      const {id, name, address, city, country, price, openTime, closeTime, description, latitude, longitude, Images, Reviews, Tags} = destinationDetails;
      const photoAttributes = placeDetails.result.photos;
      const destination = {id, name, address, city, country, price, openTime, closeTime, description, latitude, longitude, Images, Reviews, Tags, photoAttributes};
      res.status(200).json(destination);
    } catch (err) {
      next(err);
    }
  }

  static async addDestinationToSchedule(req, res, next) {
    try {
      let eventId, link, newSchedule;
      const UserId = req.user.id;
      let { plan, scheduleDate, scheduleTime, scheduleEnd, isSyncWithGoogleCalendar } = req.body;
      scheduleEnd = scheduleEnd || `23:59`;
      const DestinationId = req.params.destinationId;
      const destination = await Destination.findByPk(DestinationId);
      const timeZone = await getTimeZone(destination.latitude, destination.longitude);
      if (!destination) {
        throw { name: 'NotFound' };
      }
      if (isSyncWithGoogleCalendar === 'true') {
        const calendarInput = {
          plan,
          UserId,
          destinationName: destination.name,
          location: destination.address,
          start: `${scheduleDate}T${scheduleTime}:00`, // UTC+07:00 menunjukkan timezone WIB
          end: `${scheduleDate}T${scheduleEnd}:00`,
          timeZone
        }
        const result = await addEventToCalendar(calendarInput);
        eventId = result.data.id;
        link = result.data.htmlLink;
        newSchedule = await Schedule.create({ plan, scheduleDate, scheduleTime, scheduleEnd, isSyncWithGoogleCalendar, DestinationId, UserId, eventId, link });
      } else {
        eventId = null;
        link = null;
        newSchedule = await Schedule.create({ ...req.body, DestinationId, UserId, eventId, link, isSyncWithGoogleCalendar });
      }
      res.status(201).json({ newSchedule });
    } catch (err) {
      next(err);
    }
  }

  static async getSchedules(req, res, next) {
    try {
      let currentDate = new Date();
      let startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 7);
      const UserId = req.user.id;
      const userSchedules = await Schedule.findAll({
        where: {
          UserId,
          scheduleDate: {
            [Op.gte]: startDate
          }
        },
        order: [['scheduleDate', 'ASC'], ['scheduleTime', 'ASC']],
        include: Destination
      });
      res.status(200).json(userSchedules);
    } catch (err) {
      next(err);
    }
  }

  static async updateSchedule(req, res, next) {
    try {
      const UserId = req.user.id;
      const scheduleId = req.params.scheduleId;
      const prevSchedule = await Schedule.findByPk(scheduleId);
      if (!prevSchedule) {
        throw { name: 'NotFound' };
      }
      if (prevSchedule.UserId !== UserId) {
        throw { name: 'Forbidden' }
      }
      const { plan, scheduleDate, scheduleTime, scheduleEnd, isSyncWithGoogleCalendar } = req.body;
      let { eventId, DestinationId } = prevSchedule;
      if (isSyncWithGoogleCalendar === 'true') {
        if (!eventId) {
          const destination = await Destination.findByPk(DestinationId);
          const calendarInput = {
            plan,
            UserId,
            destinationName: destination.name,
            location: destination.address,
            start: `${scheduleDate}T${scheduleTime}:00+07:00`, // UTC+07:00 menunjukkan timezone WIB
            end: `${scheduleDate}T${scheduleEnd}:00+07:00`
          }
          const result = await addEventToCalendar(calendarInput);
          eventId = result.data.id;
          const link = result.data.htmlLink;
          await Schedule.update({ ...req.body, eventId, link }, { where: { id: scheduleId } });
        } else {
          const calendarInput = {
            plan,
            eventId,
            UserId,
            start: `${scheduleDate}T${scheduleTime}:00+07:00`, // UTC+07:00 menunjukkan timezone WIB
            end: `${scheduleDate}T${scheduleEnd}:00+07:00`
          };
          await updateScheduleOnCalendar(calendarInput);
          await Schedule.update(req.body, { where: { id: scheduleId } });
        }
      } else {
        if (eventId) {
          const deleteCalendarInput = {
            UserId,
            eventId
          };
          const result = await deleteEventFromCalendar(deleteCalendarInput);
          await Schedule.update({ ...req.body, eventId: null, link: null }, { where: { id: scheduleId } });
        } else {
          await Schedule.update(req.body, { where: { id: scheduleId } });
        }
      }
      const updatedSchedule = await Schedule.findByPk(scheduleId);
      res.status(200).json({ updatedSchedule });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSchedule(req, res, next) {
    try {
      const UserId = req.user.id;
      const { scheduleId } = req.params;
      const schedule = await Schedule.findByPk(scheduleId);
      if (schedule.UserId !== UserId) {
        throw { name: 'Forbidden' }
      }
      if (!schedule) {
        throw { name: 'NotFound' };
      }
      const { eventId } = schedule;
      if (eventId) {
        await deleteEventFromCalendar({ UserId, eventId });
      }
      await Schedule.destroy({ where: { id: scheduleId } });
      res.status(200).json({ schedule });
    } catch (err) {
      next(err);
    }
  }

  static async getTags(req, res, next) {
    try {
      const tags = await Tag.findAll({
        attributes : {
          exclude : ['createdAt', 'updatedAt']
        }
      });
      res.status(200).json(tags);
    } catch(err) {
      next(err);
    }
  }
}

module.exports = DestinationController;

