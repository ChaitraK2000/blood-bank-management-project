const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  Email: String,
  Password: String,
});

module.exports = mongoose.model("admin", UserSchema, "admin");
