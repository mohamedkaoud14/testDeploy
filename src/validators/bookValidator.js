const {
  createBookErrorMessages,
  addNewRateErrorMessages,
} = require("../helper/bookValidationMessages");
const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
const validateData = (data, callBackFunction) => {
  let errors = {};
  const { name, image, author, category } = data;

  //validate data
  if (!name || typeof name !== "string")
    errors["name"] = createBookErrorMessages.name;
  if (!image) errors["image"] = createBookErrorMessages.image;
  if (!author) errors["author"] = createBookErrorMessages.author;
  if (!category) errors["category"] = createBookErrorMessages.category;

  // check if the object is empty
  if (isEmptyObject(errors)) errors = null;
  return callBackFunction(errors);
};

const validateRate = (data, callBackFunction) => {
  let errors = {};
  const { user, stars, review } = data;

  //validate data
  if (!user) errors["user"] = addNewRateErrorMessages.user;
  if (!stars || parseInt(stars) < 0 || parseInt(stars) > 5)
    errors["stars"] = addNewRateErrorMessages.start;
  if (review && typeof review !== "string")
    errors["review"] = addNewRateErrorMessages.review;

  // check if the object is empty
  if (isEmptyObject(errors)) errors = null;
  return callBackFunction(errors);
};
module.exports = {
  validateData,
  validateRate,
};
