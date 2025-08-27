const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
require("dotenv").config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoute"));

// Route de test
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello depuis le serveur !" });
});

// Middlewares de gestion d'erreurs
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
  console.log(`📍 Environnement: ${process.env.NODE_ENV || "development"}`);
});
