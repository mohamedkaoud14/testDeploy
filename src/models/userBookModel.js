const mongoose = require("mongoose");
const shelves = require("../helper/shelves");

const userBookSchema = new mongoose.Schema({
  book: {
    type: String,
    ref: "Book",
    required: true,
  },
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  shelf: {
    type: Number,
    enum: [shelves.WANT_TO_READ, shelves.CURRENTLY_READING, shelves.READ],
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  review: {
    type: String,
    maxLength: 5000,
    trim: true,
  },
});

const userBookModel = mongoose.model("UserBook", userBookSchema);
module.exports = userBookModel;