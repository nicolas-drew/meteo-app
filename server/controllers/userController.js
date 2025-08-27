const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: errors.array(),
      });
    }

    const { email, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    const updateData = {};

    // Mise à jour email
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Erreur lors de la mise à jour de l'email",
        });
      }
      updateData.email = email;
    }

    // Mise à jour mot de passe
    if (newPassword && currentPassword) {
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        req.user.password
      );
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Mot de passe actuel incorrect",
        });
      }
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password",
    });

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

const addFavoriteCity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: errors.array(),
      });
    }

    const { cityName, coordinates } = req.body;
    const userId = req.user._id;

    // Vérifier si la ville n'est pas déjà en favoris
    const user = await User.findById(userId);
    const cityExists = user.favoriteCities.some(
      (city) => city.cityName.toLowerCase() === cityName.toLowerCase()
    );

    if (cityExists) {
      return res.status(400).json({
        success: false,
        message: "Cette ville est déjà dans vos favoris",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          favoriteCities: {
            cityName,
            coordinates: coordinates || { lat: 0, lon: 0 },
          },
        },
      },
      { new: true, select: "-password" }
    );

    res.json({
      success: true,
      message: "Ville ajoutée aux favoris",
      favoriteCities: updatedUser.favoriteCities,
    });
  } catch (error) {
    console.error("Erreur ajout favori:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

const removeFavoriteCity = async (req, res) => {
  try {
    const { cityId } = req.params;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          favoriteCities: { _id: cityId },
        },
      },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      message: "Ville supprimée des favoris",
      favoriteCities: updatedUser.favoriteCities,
    });
  } catch (error) {
    console.error("Erreur suppression favori:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

const getFavoriteCities = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("favoriteCities");

    res.json({
      success: true,
      favoriteCities: user.favoriteCities,
    });
  } catch (error) {
    console.error("Erreur récupération favoris:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Données invalides",
        errors: errors.array(),
      });
    }

    const { theme, units } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (theme) updateData["preferences.theme"] = theme;
    if (units) updateData["preferences.units"] = units;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, select: "-password" }
    );

    res.json({
      success: true,
      message: "Préférences mises à jour",
      preferences: updatedUser.preferences,
    });
  } catch (error) {
    console.error("Erreur mise à jour préférences:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "Compte supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression compte:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

module.exports = {
  updateProfile,
  addFavoriteCity,
  removeFavoriteCity,
  getFavoriteCities,
  updatePreferences,
  deleteAccount,
};
