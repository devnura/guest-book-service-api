const {body, validationResult } = require("express-validator");
const jwt = require("../../middleware/jwt.middleware");
const bcrypt = require("bcrypt");
const helper = require("../../helper/helper");
const winston = require("../../helper/winston.logger");
const moment = require("moment");
moment.locale("id");
const {
  User,
  RefreshToken,
  PersonalInfo,
  Sequelize
  // 
} = require("../../models");
var result = {};
var uniqueCode;

const createByGuest = async (req, res) => {
  try {

    // generate unique code
    uniqueCode = req.requestId;

    let {
      name,
      address,
      phone_number,
      note
    } = req.body;

    // validate 
    const isExist = await PersonalInfo.findOne({where: {
      name : name,
      phone_number : phone_number
    }})  

    if(isExist) {
        result = helper.createResponse(400, "BAD REQUEST", ["User already submit"], []);
        // log info
        winston.logger.info(
          `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
        );

        return res.status(400).send(result);
    }

    let data = await PersonalInfo.create({
      uid : helper.getUniqueCode(),
      name : name,
      address : address,
      phone_number : phone_number,
      note : note || null
    })


    result = helper.createResponse(201, "CREATED", [], data);
   
    // log info
    winston.logger.info(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(200).json(result);
  } catch (error) {
    // create log
    result = helper.createResponse(500, "Internal Server Error", error.message, []);

    winston.logger.error(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(500).json(result);
  }
};

const getListByGuest = async (req, res) => {
  try {

    // generate unique code
    uniqueCode = req.requestId;

    // validate 
    const data = await PersonalInfo.findAll({
      attributes: [
        'name',
        'note',
      ],
    })  

    result = helper.createResponse(200, "OK", [], data);
   
    // log info
    winston.logger.info(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(200).json(result);
  } catch (error) {
    // create log
    result = helper.createResponse(500, "Internal Server Error", error.message, []);

    winston.logger.error(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(500).json(result);
  }
};

// Admin section
const list = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

    // calculate offset based on page and pageSize
    const offset = (page - 1) * pageSize;

    // validate
    const data = await PersonalInfo.findAll({
      attributes: ["uid","name","address","phone_number","note","createdAt","updatedAt",],
      limit: pageSize,
      offset: offset,
    });

    const totalCount = await PersonalInfo.count(); // Get the total count of items

    // Check if the requested page is out of bounds
    if (offset >= totalCount) {
      result = helper.createResponse(400, "Bad Request", "Invalid page number", []);
      return res.status(400).json(result);
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    result = helper.createResponse(200, "OK", [], {
      data: data,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalItems: totalCount,
        totalPages: totalPages,
      },
    });

    // log info
    winston.logger.info(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(200).json(result);
  } catch (error) {
    // create log
    result = helper.createResponse(500, "Internal Server Error", error.message, []);

    winston.logger.error(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(500).json(result);
  }
};

const edit = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the identifier is in the URL parameters

    const {
      name,
      address,
      phone_number,
      note
    } = req.body;

    // Check if the record exists
    const existingRecord = await PersonalInfo.findOne({where : {
      uid : id
    }});

    if (!existingRecord) {
      result = helper.createResponse(404, "Not Found", ["Record not found"], []);
      winston.logger.info(
        `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
      );
      return res.status(404).json(result);
    }

    // Validate if the updated name and phone_number already exist for another record
    const isExist = await PersonalInfo.findOne({
      where: {
        name: name,
        phone_number: phone_number,
        uid: {
          [Sequelize.Op.not]: id, // Exclude the current record from the check
        },
      },
    });

    if (isExist) {
      result = helper.createResponse(400, "Bad Request", ["User already exists"], []);
      winston.logger.info(
        `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
      );
      return res.status(400).json(result);
    }

    // Update the record
    await existingRecord.update({
      name: name,
      address: address,
      phone_number: phone_number,
      note: note || null,
    });

    result = helper.createResponse(200, "OK", [], existingRecord);

    // log info
    winston.logger.info(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(200).json(result);
  } catch (error) {
    // create log
    result = helper.createResponse(500, "Internal Server Error", error.message, []);

    winston.logger.error(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(500).json(result);
  }
};

const deleteData = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the identifier is in the URL parameters

    // Check if the record exists
    const existingRecord = await PersonalInfo.findOne({where : {
      uid : id
    }});

    if (!existingRecord) {
      result = helper.createResponse(404, "Not Found", ["Record not found"], []);
      winston.logger.info(
        `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
      );
      return res.status(404).json(result);
    }

    // Delete the record
    await existingRecord.destroy();

    result = helper.createResponse(200, "OK", ["Record deleted successfully"], []);

    // log info
    winston.logger.info(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(200).json(result);
  } catch (error) {
    // create log
    result = helper.createResponse(500, "Internal Server Error", error.message, []);

    winston.logger.error(
      `${req.requestId} ${req.requestUrl} RESPONSE : ${JSON.stringify(result)}`
    );

    return res.status(500).json(result);
  }
};




module.exports = {
  createByGuest,
  getListByGuest,
  list,
  edit,
  deleteData
};