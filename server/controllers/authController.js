const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { generateToken } = require("../middlewares/authMiddleware");

const register = async (req, res) => {
  try {
    console.log("Inscription - Données reçues:", req.body.email);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Un compte avec cet email existe déjà",
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const token = generateToken(savedUser._id);
    console.log("Token généré pour:", savedUser.email);

    res.status(201).json({
      success: true,
      message: "Compte créé avec succès",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        favoriteCities: savedUser.favoriteCities,
        preferences: savedUser.preferences,
        createdAt: savedUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur inscription:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de l'inscription",
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("Connexion - Email:", req.body.email);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }

    const token = generateToken(user._id);
    console.log("Connexion réussie + token généré pour:", user.email);

    res.json({
      success: true,
      message: "Connexion réussie",
      user: {
        id: user._id,
        email: user.email,
        favoriteCities: user.favoriteCities,
        preferences: user.preferences,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur connexion:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la connexion",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    console.log("Profil demandé pour:", req.user.email);

    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        favoriteCities: req.user.favoriteCities,
        preferences: req.user.preferences,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Erreur récupération profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
