const userBookModel= require("../models/userBookModel");
const getAllBooks = (req, res) => {};
const getBookById = (req, res) => {};
const addNewBook = (req, res) => {};
const editBook = (req, res) => {};
const deleteBook = (req, res) => {};
const changeBookShelf = (req, res) => {};
const getBookShelve = async(req,res)=>{
  console.log("ana wslt hna",'bookID',);
  try{
  
  const shelveStatus =  await  userBookModel.findOne({book:req.params.bookId, user:req.params.userId}).select({shelf:1})
  console.log(shelveStatus);
  res.status(200).json({data:shelveStatus})
}
catch(err){
  res.end(err)
}
}

module.exports = {
  getAllBooks,
  getBookById,
  addNewBook,
  editBook,
  deleteBook,
  changeBookShelf,
  getBookShelve
};
