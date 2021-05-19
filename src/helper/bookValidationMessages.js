const createBookErrorMessages = {
  name: "The book name is Required!",
  image: "The book should has an image!",
  author: "The book author is Required!",
  category: "The book should belongs to some Category",
};

const addNewRateErrorMessages = {
  user: "The user who make this rate is Required!",
  start: "Number of star should be from 0 to 5!",
  review: "The review should contain characters!",
};
module.exports = {
  addNewRateErrorMessages,
  createBookErrorMessages,
};
