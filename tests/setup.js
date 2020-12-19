jest.setTimeout(30000);
require("../models/User");
require("../models/Blog");
const keys = require("../config/keys");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(
  keys.mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("mongodb connection error", err);
    } else {
      console.log("successfully connected to mongodb");
    }
  },
);
