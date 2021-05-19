const express = require("express");
const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const statusCode = require("./src/helper/statusCode");
const cors = require("cors");
const port = 3001;
const app = express();
const userRouter = require("./src/routes/userRoute");
const authorRouter = require("./src/routes/authorRoute");
const bookRouter = require("./src/routes/bookRoute");
const categoryRouter = require("./src/routes/categoryRoute");
const userBooksRouter = require("./src/routes/userBooksRoute");
var userHandlers = require("./src/controllers/userController.js");
const generalRouter = require("./src/routes/generalRoute");

// 39qMFmCorHkBWTzu   => my password on atlas with name kaoud 
//mongo "mongodb+srv://cluster0.gfbnc.mongodb.net/myFirstDatabase" --username kaoud

const myCredential = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gfbnc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
app.use("/public", express.static("public"));

mongoose.connect(
  // process.env.MONGO_CONNECTION_STRING+"/goodreads"||
  // "mongodb://localhost:27017/goodreads"
  // credential for atlas connection 
  myCredential
  ,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.log("falied to connect mongo", error);
      console.log(process.env.MONGODB_URI, "monkooooo");
      console.log(process.env.DB_NAME, "NAME");
      console.log(process.env.DB_PASS, "PASS");
      console.log(process.env.DB_USER, "USER");

    } else console.log("connected successfully to mongo");
  }
);

app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      "RESTFULAPIs",
      function (err, decode) {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

// routes
app.use("/users", userRouter);
app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/userBooks", userBooksRouter)
app.use("/", generalRouter);

app.get("/", (req, res) => {
  res.end("hello at home page atef");
});
//     .post(userHandlers.register);
app.listen(process.env.PORT || port, (err) => {
  if (err) console.log("error in connecting");
  else console.log("connected successfully on port " + port);
});

// app.use(express.static('public'));

// error handler middleware
app.use((err, req, res, next) => {
  console.log("**************ERROR****************** \n \n", err);
  // error from mongoDB, but dose not work !!!!!
  if (err.name === "MongoError") {
    return res
      .status(statusCode.ServerError)
      .json({ message: "some thing wrong happend" });
  }
  // error from validation
  if (err) return res.status(statusCode.BadRequest).json(err);
});
