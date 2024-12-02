const { MongoClient } = require('mongodb');
const NODE_URI = 'mongodb://localhost:27021';
const FailedLoginAttempt = require('./Failedlogin');

exports.addUser = async (data) => {
  const client = new MongoClient(NODE_URI);
  try {
    await client.connect();
    const db = client.db('UserDB');
    const collection = db.collection('User');

    const existingUser = await collection.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email déjà utilisé.');
    }

    await collection.insertOne(data);
    console.log('Utilisateur ajouté avec succès.');
  } finally {
    await client.close();
  }
};


async function handleLoginAttempt(userId, isLoginSuccessful) {
  
  let failedAttempt = await FailedLoginAttempt.findOne({ user: userId });
 
  // Crée une entrée si elle n'existe pas
  if (!failedAttempt) {
    failedAttempt = new FailedLoginAttempt({ user: userId });
  }

  // Vérifie si le compte est verrouillé
  if (failedAttempt.isLocked()) {
    const timeRemaining = Math.ceil((failedAttempt.lockedUntil - new Date()) / 1000); // Temps restant en secondes
    return { 
      success: false, 
      message: `Votre compte est verrouillé. Réessayez dans ${timeRemaining} secondes.` 
    };
  }
  

  if (isLoginSuccessful) {
    // Réinitialise les tentatives en cas de succès
    await failedAttempt.resetAttempts();
    return { success: true, message: 'Connexion réussie.' };
  } else {
    // Incrémente les tentatives en cas d'échec
    failedAttempt.attempts += 1;

    if (failedAttempt.attempts >= 3) { // Par exemple, verrouiller après 3 tentatives
      await failedAttempt.lockAccount();
      return { success: false, message: 'Votre compte est verrouillé pour 30 seconde.' };
    } else {
      await failedAttempt.save();
      return {
        success: false,
        message: `invalide password`
      };
    }
  }
}

module.exports = { handleLoginAttempt };