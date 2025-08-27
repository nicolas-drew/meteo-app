const errorHandler = (err, req, res, next) => {
  console.error("Erreur capturée:", err);

  // Erreur de validation Mongoose
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Erreur de validation",
      errors,
    });
  }

  // Erreur de duplication (email déjà existant)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Cette ressource existe déjà",
    });
  }

  // Erreur JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token invalide",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expiré",
    });
  }

  // Erreur MongoDB CastError (ID invalide)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Ressource non trouvée",
    });
  }

  // Erreur générique
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Erreur serveur interne",
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Non trouvé - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
