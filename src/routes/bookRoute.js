const express = require("express");
const Router = express.Router();
const bookController = require("../controllers/bookController");
const { upload } = require("../middlewares/MulterMiddleware");
const paginateMode = require("../middlewares/paginateModel");
const BookModel = require("../models/bookModel");
Router.get("/", paginateMode(BookModel), (req, res, next) => {
  bookController.getAllBooks(req, res, next);
});

Router.get("/:id", (req, res, next) => {
  bookController.getBookById(req, res, next);
});

Router.post("/", upload.single("image"), (req, res, next) => {
  bookController.createBook(req, res, next);
});

Router.patch("/:id", upload.single("image"), (req, res, next) => {
  bookController.updateBook(req, res, next);
});

Router.delete("/:id", (req, res, next) => {
  bookController.deleteBook(req, res, next);
});

Router.post("/:id/rate", bookController.rateBook);

Router.post("/:id/shelve", bookController.shelveBook);
Router.post("/:id/review", bookController.reviewBook);

module.exports = Router;
