const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 200,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    maxLength: 2000,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  avgRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
});

// populate the author and cateogy to use it with pagination
bookSchema.pre("find", function () {
  this.populate("author").populate("category");
});
const BookModel = mongoose.model("Book", bookSchema);
module.exports = BookModel;
