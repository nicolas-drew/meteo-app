const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email requis"],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email invalide"],
    },
    password: {
      type: String,
      required: [true, "Mot de passe requis"],
      minlength: [8, "Mot de passe minimum 8 caractères"],
    },

    favoriteCities: [
      {
        cityName: String,
        coordinates: {
          lat: Number,
          lon: Number,
        },
      },
    ],

    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "auto",
      },
      units: {
        type: String,
        enum: ["metric", "imperial"],
        default: "metric",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
