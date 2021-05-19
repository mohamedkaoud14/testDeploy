const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserScheme = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    },
  lastname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
     unique: true,
    lowercase: true,
    trim: true,
  },
  password: String,
  avatar: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user", "author"],
    default: "user",
  },
  gender: {
    type: String,
    //  required: true,
    enum: ["Male", "Female"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

UserScheme.methods.comparePassword = function (password, hash_password) {
  try {
    return bcrypt.compareSync(password, this.password);
  } catch (err) {
    console.log(err);
  }
};

const UserModel = mongoose.model("User", UserScheme);
module.exports = UserModel;
