const express = require("express"),

 Router = express.Router(),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt')

const {register, sign_in,users } = require('../controllers/userController.js');
const {loginRequired} = require("../middlewares/AuthMiddleware.js")
const {upload}= require("../middlewares/MulterMiddleware.js")
const userBooksRouter = require("./userBooksRoute");

Router.post("/register" , upload.single('avatar') ,register)

Router.post("/signin", sign_in)

Router.get("/", loginRequired, users)
Router.use("/:userId/books", userBooksRouter);

    module.exports = Router
