const { addUser , handleLoginAttempt } = require('./userController');
const { sendVerificationEmail } = require('../service/mailService');
const {connectToDatabase} = require('../Config/db')
const { MongoClient } = require("mongodb");
const crypto = require('crypto');
const Key = require('../../crypto/modules/key');
const Aes = require('../../crypto/modules/aes');
require('../../crypto/modules/aesCTR')
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
    console.log(verificationCode)
    verificationCodes.set(email, { username, password, code: verificationCode ,passEditor,passManager});
   await sendVerificationEmail(email, verificationCode);

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
    const email1 = Key.hmacSHA256(email).toString("hex")
    const username = Key.hmacSHA256(storedData.username).toString("hex")
    const password = Key.hmacSHA256(storedData.password).toString("hex")
    const passEditor = Key.hmacSHA256(storedData.passEditor).toString("hex")
    const passManager = Key.hmacSHA256(storedData.passManager).toString("hex")

    await addUser({
      username: username,
      email : email1,
      password: password,
      passEditor: passEditor,
      passManager: passManager
    });

    verificationCodes.delete(email);
    const account = {
      email : email,
      username : storedData.username
    }
    const accountString = JSON.stringify(account);
    const cles = crypto.randomBytes(5).toString("hex").slice(0, 9);
    let  info = Aes.Ctr.encrypt(accountString,cles,256)
    // Mélanger la clé dans `info` à la position 4
    const position = 4; // Position après laquelle insérer la clé
    const mixedInfo = info.slice(0, position) + cles + info.slice(position);


    res.status(200).json({ message: 'Utilisateur créé avec succès !' ,info : mixedInfo});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




exports.login = async (req, res) => {
  try {
    let { username ,  password } = req.body;
    let userId = null; // ID partagé entre les bases
    let client = null;
    console.log("username",username)
    username = Key.hmacSHA256(username).toString('hex');
    password = Key.hmacSHA256(password).toString('hex')
    // Étape 1 : Rechercher l'email
    for (const uri of NODE_URIS) {
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db();
      const collection = db.collection("User");

      const user = await collection.findOne({ username });
      if (user) {
        userId = user._id; // Conserver l'ID tel qu'il est
        break;
      }
      await client.close(); // Fermer la connexion si aucun utilisateur trouvé
    }

    if (!userId) {
      return res.status(400).json({ error: "Username not found " });
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
    let email = null;
    for (const uri of NODE_URIS) {
      client = new MongoClient(uri);
      await client.connect();
      const db = client.db();
      const collection = db.collection("User");
      console.log(uri)
      const user = await collection.findOne({ _id: userId });
      if (user.email) {
        email = user.email;
        break;
      }
      await client.close();
    }

    console.log(username)
    if (!email) {
      return res.status(400).json({ error: "Account does not exist" });
    }
    const account = {
      email : email,
      username : username
    }
    const accountString = JSON.stringify(account);
    const cles = crypto.randomBytes(5).toString("hex").slice(0, 9);
    let  info = Aes.Ctr.encrypt(accountString,cles,256)
    // Mélanger la clé dans `info` à la position 4
    const position = 4; // Position après laquelle insérer la clé
    const mixedInfo = info.slice(0, position) + cles + info.slice(position);

    if (client) await client.close();
    res.status(200).json({ message: "Login successful", info : mixedInfo });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.VerfAdmin = async (req,res) =>{
  try{
   let passEditor = req.body.passEditor
   let user = req.body.user
  const extractedKey = user.slice(4, 4 + 9);
        const originalEncryptedInfo = user.slice(0, 4) + user.slice( 4 + 9);
        const decryptedInfo =  Aes.Ctr.decrypt(originalEncryptedInfo, extractedKey,256);
        console.log(decryptedInfo)
        let email = decryptedInfo.email
        passEditor = Key.hmacSHA256(passEditor).toString('hex');
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
            let userPassword = null;
                for (const uri of NODE_URIS) {
                  client = new MongoClient(uri);
                  await client.connect();
                  const db = client.db();
                  const collection = db.collection("User");
                  const user = await collection.findOne({ _id: userId });
                  if (user.passEditor) {
                    userPassword = user.passEditor;
                    break;
                  }
                  await client.close();
                }
                
                if (!userPassword) {
                  return res.status(400).json({ error: "Password not found for this account" });
                }
  
                if(userPassword !== passEditor){
                  return res.status(400).json({ error: "Password is incorrect" });
                }
                return res.status(200).json({message : 'password correct'}) 

  }catch(err){
     return res.status(400).json({error : err.message})
  }
}