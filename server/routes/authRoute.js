const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { register, login } = require("../controllers/authController");

const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Mot de passe requis"),
];

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

module.exports = router;
