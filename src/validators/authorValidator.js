const validationErrorMessages = require("../helper/authorValidationMessages");
const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};
const validateData = (data, callBackFunction) => {
  let errors = {};
  const { firstname, lastname, gender, dob, avatar, role } = data;
  //validate data
  if (!firstname || typeof firstname !== "string")
    errors["firstname"] = validationErrorMessages.firstname;
  if (!lastname || typeof lastname !== "string")
    errors["lastname"] = validationErrorMessages.lastname;
  // if (!gender || typeof gender !== "string")
  //   errors["gender"] = validationErrorMessages.gender;
  //  if (!dob) errors["dob"] = validationErrorMessages.DOB;
   if (!avatar) errors["avatar"] = validationErrorMessages.avatar;
  if (!role || role !== "author") {
    errors["role"] = validationErrorMessages.role;
  }

  // check if the object is empty
  if (isEmptyObject(errors)) errors = null;
  return callBackFunction(errors);
};

module.exports = {
  validateData,
};
