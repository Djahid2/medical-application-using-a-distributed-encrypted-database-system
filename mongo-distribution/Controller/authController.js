const { addUser , handleLoginAttempt } = require('./userController');
const { sendVerificationEmail } = require('../service/mailService');
const {connectToDatabase} = require('../Config/db')
const { MongoClient } = require("mongodb");
const crypto = require('crypto');
const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];
const verificationCodes = new Map(); // Stock temporaire

exports.register = async (req, res) => {
  try {
    const { username, email, password , passEditor, passManager } = req.body;
    const verificationCode = crypto.randomBytes(3).toString('hex');

    verificationCodes.set(email, { username, password, code: verificationCode ,passEditor,passManager});
    //await sendVerificationEmail(email, verificationCode);
    console.log(verificationCode)

    res.status(200).json({ message: 'Code de vérification envoyé.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, Code } = req.body;
    const storedData = verificationCodes.get(email);
    if (!storedData || storedData.code !== Code) {
      return res.status(400).json({ error: 'Code incorrect ou expiré.' });
    }
    console.log("hna hbset")
    await addUser({
      username: storedData.username,
      email,
      password: storedData.password,
      passEditor: storedData.passEditor,
      passManager: storedData.passManager
    });

    verificationCodes.delete(email);
    res.status(200).json({ message: 'Utilisateur créé avec succès !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let userId = null; // ID partagé entre les bases
    let client = null;

    // Étape 1 : Rechercher l'email
    for (const uri of NODE_URIS) {
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db();
      const collection = db.collection("User");

      const user = await collection.findOne({ email });
      if (user) {
        userId = user._id; // Conserver l'ID tel qu'il est
        break;
      }
      await client.close(); // Fermer la connexion si aucun utilisateur trouvé
    }

    if (!userId) {
      return res.status(400).json({ error: "Account does not exist" });
    }

    // Étape 2 : Rechercher le mot de passe dans une autre base
    let userPassword = null;
    for (const uri of NODE_URIS) {
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db();
      const collection = db.collection("User");
      const user = await collection.findOne({ _id: userId });
      if (user.password) {
        userPassword = user.password;
        break;
      }
      await client.close();
    }
    
    if (!userPassword) {
      return res.status(400).json({ error: "Password not found for this account" });
    }

    // Étape 3 : Vérifier le mot de passe
    if (userPassword !== password) {
      

      const loginResponse = await handleLoginAttempt(userId, false);
      if (client) await client.close();
      return res.status(400).json({ error: loginResponse.message });
    }

    // Réinitialiser les tentatives de connexion en cas de succès
    await handleLoginAttempt(userId, true);

    // Étape 4 : Rechercher le `username` dans une autre base
    let username = null;
    for (const uri of NODE_URIS) {
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db();
      const collection = db.collection("User");
      console.log(uri)
      const user = await collection.findOne({ _id: userId });
      if (user.username) {
        username = user.username;
        break;
      }
      await client.close();
    }

    console.log(username)
    if (!username) {
      return res.status(400).json({ error: "Username not found for this account" });
    }

    if (client) await client.close();
    res.status(200).json({ message: "Login successful", username });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};
