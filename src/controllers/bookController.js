const bookModel = require("../models/bookModel");
const statusCode = require("../helper/statusCode");
const bookValidator = require("../validators/bookValidator");
const handler = require("../helper/controllersHelper");
const UserBookModel = require("../models/userBookModel");
const shelves = require("../helper/shelves");
const UserModel = require("../models/userModel");
const CategoryModel = require("../models/categoryModel.js");
const userBookModel = require("../models/userBookModel");

const getAllBooks = async (req, res) => {
  // get all books
  if (req.paginatedResult.data.length > 0)
    return res.status(statusCode.Success).json(req.paginatedResult); // collection has data
  return res.status(statusCode.NoContent).end(); // collection is empty
};

const getBookById = async (req, res, next) => {
  const bookId = req.params.id;
  if (!bookId) handler.handelEmptyData(res);
  try {
    const book = await bookModel
      .findById(bookId)
      .populate("author")
      .populate("category")
      .exec();

    // get all reviews, and populate the users inside them.
    //  -> to attach its avatar,
    let reviews = await userBookModel
      .find({ book: bookId })
      .populate("user")
      .exec();
    if (book) return res.status(statusCode.Success).json({ book, reviews });
    return res.status(statusCode.NoContent).end();
  } catch (error) {
    next(error);
  }
};

const createBook = (req, res, next) => {
  let data = req.body;

  // replace the field image with the path
  data = {
    ...data,
    image: req.file.path,
  };

  // function gard
  if (!data) handler.handelEmptyData(res);

  // validate the data before create a new book
  bookValidator.validateData({ ...data }, async (err) => {
    if (err) return next(err);
    try {
      // craete a new book
      let newBook = new bookModel({ ...data });
      newBook = await (await newBook.save())
        .populate("author")
        .populate("category")
        .execPopulate();
      res.status(statusCode.Created).json(newBook);
    } catch (error) {
      next(error);
    }
  });
};

const updateBook = (req, res, next) => {
  let data = req.body;

  // replace the field image with the path
  if (req.file.path) {
    data = {
      ...data,
      image: req.file.path,
    };
  }
  // function gard
  if (!data) handler.handelEmptyData(res);

  //validate the data before update it
  bookValidator.validateData({ ...data }, async (err) => {
    if (err) return next(err);
    try {
      // update the book with new data
      const updatedBook = await bookModel
        .findByIdAndUpdate({ _id: req.params.id }, { ...data }, { new: true })
        .populate("author")
        .populate("category")
        .exec();
      res.status(statusCode.Success).json(updatedBook);
    } catch (error) {
      next(error);
    }
  });
};

const deleteBook = async (req, res, next) => {
  const bookId = req.params.id;
  if (!bookId) handler.handelEmptyData(res);
  try {
    const resulat = await bookModel.findByIdAndDelete({ _id: bookId });
    res.status(statusCode.NoContent).end();
  } catch (error) {
    next(error);
  }
};

async function updateBookAvgRating(bookId) {
  const ratings = await UserBookModel.find({
    book: bookId,
    rating: { $exists: true },
  });
  const avgRating =
    ratings.reduce((total, next) => total + next.rating, 0) / ratings.length;
  const book = await bookModel.findOneAndUpdate(
    { _id: bookId },
    { avgRating: avgRating }
  );
}

async function updateExistingRating({ userId, bookId, rating }) {
  return await UserBookModel.findOneAndUpdate(
    { book: bookId, user: userId },
    { rating: rating }
  );
}

async function addNewRating({ bookId, userId, rating }) {
  const userBookInstance = new UserBookModel({
    book: bookId,
    user: userId,
    rating: rating,
    shelf: shelves.READ,
  });
  return await userBookInstance.save();
}

// Rate book.
const rateBook = async (request, response) => {
  try {
    const rating = {
      userId: request.body.user,
      bookId: request.params.id,
      rating: request.body.rating,
    };
    const book = await updateExistingRating(rating);
    if (book) response.sendStatus(statusCode.Success);
    else {
      const userBookDoc = addNewRating(rating);
      response.status(statusCode.Success).json(userBookDoc);
    }
    updateBookAvgRating(rating.bookId);
  } catch (err) {
    return response.status(statusCode.ServerError).json(err);
  }
};

// review book
const reviewBook = async (req, res, next) => {
  if (!req.body) return handler.handelEmptyData();
  const { bookId, userId, review } = req.body;
  try {
    const updatedBook = await UserBookModel.findOneAndUpdate(
      { book: bookId, user: userId },
      { review: review }
    );
    return res.status(statusCode.Success).json(updatedBook);
  } catch (error) {
    next(error);
  }
};

async function removeBookFromShelf({ bookId, userId }) {
  return await UserBookModel.findOneAndDelete({ book: bookId, user: userId });
}

async function addBookToShelf({ bookId, userId, shelf }) {
  const userBookInstance = new UserBookModel({
    book: bookId,
    user: userId,
    shelf: shelf,
  });
  await userBookInstance.save();
}

async function updateBookShelf({ bookId, userId, shelf }) {
  return await UserBookModel.findOneAndUpdate(
    { book: bookId, user: userId },
    { shelf: shelf }
  );
}

const shelveBook = async (request, response) => {
  try {
    const bookShelf = {
      userId: request.body.user,
      bookId: request.params.id,
      shelf: request.body.shelf,
    };
    if (bookShelf.shelf === 0) removeBookFromShelf(bookShelf);
    else {
      const book = await updateBookShelf(bookShelf);
      if (!book) addBookToShelf(bookShelf);
    }
    return response.sendStatus(statusCode.Success);
  } catch (err) {
    return response.sendStatus(statusCode.ServerError).json(err);
  }
};

const getPopularBooks = async (request, response) => {
  try {
    let popularBooks = await UserBookModel.aggregate([
      { $match: { rating: { $exists: true } } },
      { $group: { _id: "$book", books: { $sum: 1 } } },
      { $sort: { books: -1 } },
      { $limit: 4 },
      { $unset: "books" },
      {
        $project: {
          _id: 0,
          book: "$_id",
        },
      },
    ]);
    popularBooks = await bookModel.populate(popularBooks, { path: "book" });
    popularBooks = await UserModel.populate(popularBooks, {
      path: "book.author",
      select: { firstname: 1, lastname: 1 },
    });
    popularBooks = await CategoryModel.populate(popularBooks, {
      path: "book.category",
    });
    return response.status(statusCode.Success).json(popularBooks);
  } catch (err) {
    return response.sendStatus(statusCode.ServerError).json(err);
  }
};

const getPopularAuthors = async (request, response) => {
  try {
    let authors = await bookModel.aggregate([
      { $group: { _id: "$author", books: { $sum: 1 } } },
      { $sort: { books: -1 } },
      { $limit: 4 },
      { $unset: "books" },
      {
        $project: {
          _id: 0,
          author: "$_id",
        },
      },
    ]);
    authors = await UserModel.populate(authors, {
      path: "author",
      select: { firstname: 1, lastname: 1, avatar: 1 },
    });

    return response.status(statusCode.Success).json(authors);
  } catch (err) {
    return response.sendStatus(statusCode.ServerError).json(err);
  }
  ccd;
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  deleteBook,
  updateBook,
  rateBook,
  shelveBook,
  getPopularBooks,
  getPopularAuthors,
  reviewBook,
};
