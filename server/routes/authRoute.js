const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body } = require("express-validator");

const registerValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").exists(),
];

module.exports = router;
