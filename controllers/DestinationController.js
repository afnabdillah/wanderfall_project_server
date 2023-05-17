const { Op } = require("sequelize");
const {
  Destination,
  Tag,
  Image,
  Review,
  Users,
  Profile,
  Schedule,
} = require("../models");
const { getPlaceDetails } = require("./googlePlaces");

class DestinationController {
  static async destinations(req, res, next) {
    try {
      let { search, tag, page, size } = req.query;
      search = search ?? "";
      tag = tag ?? "";
      page = page ?? 1;
      size = size ?? 5;
      const { rows, count } = await Destination.findAndCountAll({
        where: {
          name: {
            [Op.iLike]: `%${search}%`,
          },
        },
        include: [
          Image,
          Review,
          {
            model: Tag,
            where: {
              name: {
                [Op.iLike]: `%${tag}%`,
              },
            },
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: size,
        offset: (page - 1) * size,
        distinct: true,
      });
      const destinations = rows;
      res.status(200).json({ destinations, count });
    } catch (err) {
      next(err);
    }
  }

  static async destinationDetails(req, res, next) {
    try {
      const { destinationId } = req.params;
      const destinationDetails = await Destination.findOne({
        where: { id: destinationId },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          Image,
          {
            model: Review,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: {
              model: Users,
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
              include: {
                model: Profile,
                attributes: ["userPhoto"],
              },
            },
          },
          Tag,
        ],
      });
      if (!destinationDetails) {
        throw { name: "NotFound" };
      }
      const placeDetails = await getPlaceDetails(
        destinationDetails.googlePlaceId
      );
      const {
        id,
        name,
        address,
        city,
        country,
        price,
        openTime,
        closeTime,
        description,
        latitude,
        longitude,
        Images,
        Reviews,
        Tags,
      } = destinationDetails;
      const photoAttributes = placeDetails.result.photos;
      const destination = {
        id,
        name,
        address,
        city,
        country,
        price,
        openTime,
        closeTime,
        description,
        latitude,
        longitude,
        Images,
        Reviews,
        Tags,
        photoAttributes,
      };
      res.status(200).json(destination);
    } catch (err) {
      next(err);
    }
  }

  static async addDestinationToSchedule(req, res, next) {
    try {
      const UserId = req.user.id;
      const DestinationId = req.params.destinationId;
      const newSchedule = await Schedule.create({
        ...req.body,
        UserId,
        DestinationId
      })
      res.status(201).json(newSchedule);
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
            [Op.gte]: startDate,
          },
        },
        order: [
          ["scheduleDate", "ASC"],
          ["scheduleTime", "ASC"],
        ],
        include: Destination,
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
        throw { name: "NotFound" };
      }
      if (prevSchedule.UserId !== UserId) {
        throw { name: "Forbidden" };
      }
      await Schedule.update(req.body, { where: { id: scheduleId } });
      res.status(200).json({ message: "Schedule has been updated!" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSchedule(req, res, next) {
    try {
      const UserId = req.user.id;
      const { scheduleId } = req.params;
      const schedule = await Schedule.findByPk(scheduleId);
      if (!schedule) {
        throw { name: "NotFound" };
      }
      if (schedule.UserId !== UserId) {
        throw { name: "Forbidden" };
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
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json(tags);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = DestinationController;
