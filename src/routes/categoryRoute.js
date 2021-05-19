const express = require("express")
const {createOne , getAll, deleteOne,updateOne} = require('../controllers/categoryController.js');
const {isAdmin} =require("../middlewares/AdminMiddleware")
const paginateMode = require("../middlewares/paginateModel");
const CategoryModel = require("../models/categoryModel");
Router = express.Router()
Router.route("/").post(isAdmin,createOne).get(paginateMode(CategoryModel),getAll)
// Router.route('/:id')
Router.route("/:id").delete(isAdmin,deleteOne).put(updateOne)
module.exports = Router
