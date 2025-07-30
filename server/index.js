const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
require("dotenv").config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello depuis le serveur !" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
