const express = require("express");
// mergeParams to receved the parent params in the request object
const Router = express.Router({ mergeParams: true });
const userBooksController = require("../controllers/userBooksController");

Router.get("/", (req, res) => {
  userBooksController.getAllBooks(req, res);
});

Router.get("/:id", (req, res) => {
  userBooksController.getBookById(req, res);
});

Router.post("/", (req, res) => {
  userBooksController.addNewBook(req, res);
});

Router.patch("/:id", (req, res) => {
  userBooksController.changeBookShelf(req, res);
});

Router.delete("/:id", (req, res) => {
  userBooksController.deleteBook(req, res);
});
Router.get('/:bookId/user/:userId/shelve',(req,res,next)=>{console.log("halaaa")
 next()},userBooksController.getBookShelve)

module.exports = Router;
