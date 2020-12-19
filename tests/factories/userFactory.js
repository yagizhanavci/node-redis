const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = async () => {
  return await new User({}).save();
};
