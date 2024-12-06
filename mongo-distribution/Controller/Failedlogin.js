const mongoose = require('mongoose');

// Schéma pour les tentatives de connexion échouées
const failedLoginAttemptSchema = new mongoose.Schema({
  user: {
    type: String,
    ref: 'User', // Assurez-vous que vous avez un modèle 'User' dans Mongoose
    required: true,
    unique: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  lockedUntil: {
    type: Date,
    default: null
  }
});

// Méthode pour vérifier si le compte est verrouillé
failedLoginAttemptSchema.methods.isLocked = function () {
  if (this.lockedUntil && this.lockedUntil > new Date()) {
    return true;
  }
  return false;
};

// Méthode pour réinitialiser les tentatives échouées
failedLoginAttemptSchema.methods.resetAttempts = function () {
  this.attempts = 0;
  this.lockedUntil = null;
  return this.save();
};

// Méthode pour verrouiller le compte
failedLoginAttemptSchema.methods.lockAccount = function () {
  this.attempts = 0;
  this.lockedUntil = new Date(Date.now() + 30 * 1000); // Verrouille pendant 30 secondes
  return this.save();
};

// Exporter le modèle
module.exports = mongoose.model('FailedLoginAttempt', failedLoginAttemptSchema);
