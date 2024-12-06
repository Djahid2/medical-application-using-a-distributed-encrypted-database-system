const { MongoClient } = require("mongodb");
const FailedLoginAttempt = require('./Failedlogin');
const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

function distributeRandomly(data) {
  const keys = Object.keys(data);
  const nodeData = Array.from({ length: NODE_URIS.length }, () => ({}));

  while (keys.length > 0) {
    for (let i = 0; i < NODE_URIS.length && keys.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * keys.length);
      const key = keys.splice(randomIndex, 1)[0];
      nodeData[i][key] = data[key];
    }
  }

  return nodeData;
}

async function isEmailUsed(email) {
  for (const uri of NODE_URIS) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("User");
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return true;
      }
    } finally {
      await client.close();
    }
  }
  return false;
}


exports.addUser = async (data) => {
  if (await isEmailUsed(data.email)) {
    throw new Error("Email déjà utilisé.");
  }

  const distributedData = distributeRandomly(data);

  // Assign a unique `_id` to all parts
  const newId = Date.now().toString(); // Generate a unique ID based on timestamp

  for (let i = 0; i < NODE_URIS.length; i++) {
    const client = new MongoClient(NODE_URIS[i]);
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("User");

      distributedData[i]._id = newId; 
      await collection.insertOne(distributedData[i]);
    } finally {
      await client.close();
    }
  }

  console.log("Utilisateur ajouté avec succès.");
};


exports.handleLoginAttempt = async (userId, isLoginSuccessful) => {
  
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

