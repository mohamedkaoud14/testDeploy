const express = require("express");
const Router = express.Router();
const authorController = require("../controllers/authorController.js");

const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

Router.get("/", (req, res, next) => {
  authorController.getAllAuthors(req, res, next);
});

Router.get("/:id", (req, res, next) => {
  authorController.getAuthorById(req, res, next);
});

Router.post("/", upload.single("avatar"), (req, res, next) => {
  console.log("my request  file ", req.file)

    console.log("my request ", req.body)
   authorController.createAuthor(req, res, next);
});

Router.patch("/:id", upload.single("avatar"), (req, res, next) => {
  authorController.updateAuthor(req, res, next);
});

Router.delete("/:id", (req, res, next) => {
  authorController.deleteAuthor(req, res, next);
});

module.exports = Router;
