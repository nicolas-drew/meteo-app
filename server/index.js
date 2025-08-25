const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
require("dotenv").config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
// Route de test
app.post("/api/test-user", async (req, res) => {
  try {
    const User = require("./models/user");

    const testUser = new User({
      email: "test@example.com",
      password: "motdepasse123",
    });

    const savedUser = await testUser.save();
    console.log("Utilisateur créé:", savedUser);

    res.json({
      success: true,
      message: "Utilisateur test créé !",
      userId: savedUser._id,
    });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoute"));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello depuis le serveur !" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
