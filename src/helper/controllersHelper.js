const statusCode = require("../helper/statusCode");
const handelEmptyData = (res) => res.status(statusCode.BadRequest).end();

module.exports = {
  handelEmptyData,
};
