const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let registerSchma = Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "user"],
  },
});

module.exports = mongoose.model("Register", registerSchma);
