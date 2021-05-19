const express = require("express");
const Router = express.Router({ mergeParams: true });
const bookController = require("../controllers/bookController");
const categoryController = require("../controllers/categoryController");

Router.get("/popular/books",bookController.getPopularBooks);

Router.get("/popular/categories", categoryController.getPopularCategories);

Router.get("/popular/authors", bookController.getPopularAuthors);

module.exports = Router;
