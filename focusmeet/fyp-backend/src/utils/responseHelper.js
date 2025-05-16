// src/utils/responseHelper.js
const Response = require("../models/responseModel");

const insertResponseToDB = async ({ userId, name, meetingId, isAttentive, timestamp }) => {
  return await Response.create({ userId, name, meetingId, isAttentive, timestamp });
};

module.exports = insertResponseToDB;
