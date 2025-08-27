const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  updateProfile,
  addFavoriteCity,
  removeFavoriteCity,
  getFavoriteCities,
  updatePreferences,
  deleteAccount,
} = require("../controllers/userController");
const { body, param } = require("express-validator");

// Middleware d'authentification pour toutes les routes
router.use(authenticateToken);

// Validation pour mise à jour profil
const updateProfileValidation = [
  body("email").optional().isEmail().normalizeEmail(),
  body("currentPassword").optional().isLength({ min: 1 }),
  body("newPassword").optional().isLength({ min: 8 }),
];

// Validation pour ville favorite
const favoriteCityValidation = [
  body("cityName").notEmpty().withMessage("Nom de ville requis"),
  body("coordinates.lat").optional().isFloat({ min: -90, max: 90 }),
  body("coordinates.lon").optional().isFloat({ min: -180, max: 180 }),
];

// Validation pour préférences
const preferencesValidation = [
  body("theme").optional().isIn(["light", "dark", "auto"]),
  body("units").optional().isIn(["metric", "imperial"]),
];

// Routes
router.put("/profile", updateProfileValidation, updateProfile);
router.post("/favorites", favoriteCityValidation, addFavoriteCity);
router.delete("/favorites/:cityId", removeFavoriteCity);
router.get("/favorites", getFavoriteCities);
router.put("/preferences", preferencesValidation, updatePreferences);
router.delete("/account", deleteAccount);

module.exports = router;
