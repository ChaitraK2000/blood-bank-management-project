const mongoose = require("mongoose");

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const UserSchema = mongoose.Schema({
  FirstName: { type: String, required: true, minlength: 3, maxlength: 50 },
  LastName: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  age: { type: Number, required: true },
  city: { type: String, required: true },
  email: {
    type: String,
    required: true,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  phone: { type: Number, required: true },
  address: { type: String, required: true },
  Username: String,
  Password1: String,
  gender: { type: String, required: true },
  blood: { type: String, required: true },
});

var user = mongoose.model("info", UserSchema);
module.exports = user;
