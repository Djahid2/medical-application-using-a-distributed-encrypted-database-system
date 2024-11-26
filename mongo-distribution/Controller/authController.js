const { addUser } = require('./userController');
const { sendVerificationEmail } = require('../service/mailService');
const {connectToDatabase} = require('../Config/db')
const crypto = require('crypto');

const verificationCodes = new Map(); // Stock temporaire

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const verificationCode = crypto.randomBytes(3).toString('hex');

    verificationCodes.set(email, { username, password, code: verificationCode });
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

    await addUser({
      username: storedData.username,
      email,
      password: storedData.password,
    });

    verificationCodes.delete(email);
    res.status(200).json({ message: 'Utilisateur créé avec succès !' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const client = await connectToDatabase();
  // Logique de connexion
  try{
    const {email,password} = req.body
   
    const db = client.db("UserDB");
    const collection = db.collection("User");
    const existingUser = await collection.findOne({ email });
    if (!existingUser) {
      await client.close();
      return res.status(400).json({ error: "account not exist" });
    }
    if(existingUser.password !== password){
      await client.close();
      return res.status(400).json({ error: "password incorrect" });
    }
    res.status(200).json({ username: existingUser.username });
    
  
    }catch(err){
      console.error(err.message);
      res.status(400).json({ error: err.message });
    }
};
