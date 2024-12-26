const { MongoClient } = require("mongodb");
const FailedLoginAttempt = require('./Failedlogin');
const Key = require('../../crypto/modules/key');
const {distributeData} = require('../InsertData');
const {getLastMatricules} = require("../GetLastMat");
const {getLatestData,findData} = require("../FindData")
const Aes = require('../../crypto/modules/aes');
require('../../crypto/modules/aesCTR');
const {deleteData} = require("../DeleteData");
const {modifyData} = require("../ModifyData")
const {RechercheNom,RechercheFileStatus,RechercheDiagnosis} = require("../RechercheData")
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

async function isUsernameUsed(username) {
  for (const uri of NODE_URIS) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("User");
      const existingUser = await collection.findOne({ username });
      if (existingUser) {
        return true;
      }
    } finally {
      await client.close();
    }
  }
  return false;
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
  if (await isUsernameUsed(data.username)) {
    throw new Error("username déjà utilisé.");
  }

  const distributedData = distributeRandomly(data);
  console.log('aaaaaaaaaaaa')
  // Assign a unique `_id` to all parts
  let newId = Date.now().toString(); // Generate a unique ID based on timestamp
  newId = Key.hmacSHA256(newId).toString('hex')
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


 async function transformToSampleDossier(data) {
  let nextAppointmentDateTime = "";
  if (data.next_appointment_date && data.next_appointment_Time) {
    nextAppointmentDateTime = new Date(
      `${data.next_appointment_date}T${data.next_appointment_Time}`
    ).toISOString();
  }

  return {
    file_status: data.file_status || "active",
    emergency_contact: JSON.stringify(data.emergency_contact || [{}]), // Ajoutez une valeur par défaut
    insurance_details: JSON.stringify(data.insurance_details || {}),
    medical_history: JSON.stringify(data.medical_history || []),
    diagnoses: JSON.stringify(data.diagnoses || []),
    allergies: data.allergies || "",
    medications: JSON.stringify(data.medications || []),
    treatments: JSON.stringify(data.treatments || []),
    lab_results: JSON.stringify(data.lab_results || []),
    doctor_notes: data.doctor_notes || "",
    symptoms: JSON.stringify(data.symptoms || []),
    vital_signs: JSON.stringify(data.vital_signs || {}),
    next_appointment_date: nextAppointmentDateTime,
    date_naissance_patient: data.date_naissance_patient || "",
    nom_patient: data.patientName || "Nom Prenom",
  };
}
async function removeDynamicKeys(data) {
  // Vérifiez si c'est un tableau
  if (Array.isArray(data)) {
    // Traitez chaque élément du tableau en attendant sa résolution
    return Promise.all(data.map(removeDynamicKeys)); 
  }

  // Vérifiez si c'est un objet avec des clés dynamiques
  if (typeof data === "object" && data !== null) {
    const keys = Object.keys(data);

    // Si la première clé contient un objet imbriqué, retirez la clé dynamique
    if (keys.length === 1 && typeof data[keys[0]] === "object") {
      return removeDynamicKeys(data[keys[0]]);
    }

    // Traitez récursivement chaque valeur en attendant la résolution des Promesses
    const newData = {};
    for (const key of keys) {
      newData[key] = await removeDynamicKeys(data[key]);
    }
    return newData;
  }

  // Résoudre les Promesses si la donnée est une Promesse
  if (data instanceof Promise) {
    return await data;
  }

  // Retournez les autres types de données directement
  return data;
}



exports.AddPatient = async (req, res) =>{
try{
  let {data1 ,passManager , user}  = req.body;
  //Etap1 verfier Admin 
  const extractedKey = user.slice(4, 4 + 9);
  const originalEncryptedInfo = user.slice(0, 4) + user.slice( 4 + 9);
  const decryptedInfo =  Aes.Ctr.decrypt(originalEncryptedInfo, extractedKey,256);
  console.log(decryptedInfo)
  let email = decryptedInfo.email
  passManager = Key.hmacSHA256(passManager).toString('hex');
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
            if (user.passManager) {
              userPassword = user.passManager;
              break;
            }
            await client.close();
          }
          
          if (!userPassword) {
            return res.status(400).json({ error: "Password not found for this account" });
          }

          if(userPassword !== passManager){
            return res.status(400).json({ error: "Password is incorrect" });
          }
  //Etap 2 ajouter Patient
  const data = await  removeDynamicKeys(data1);
  console.log(data)
  console.log("status",data.file_status)
   const simple_data =  await transformToSampleDossier(data)
   console.log(simple_data)
   await distributeData(simple_data);
   return res.status(200).json({ message: "Patient add" });
}catch(err){
  return res.status(400).json({ error: "erron in insertion patient" });
}
}

///////////////////////
exports.Getpatient = async (req, res) =>{
  try{
  (async () => {
    const matricules = await getLastMatricules();
    const data = await getLatestData(matricules);
    return res.status(200).json({ message: "Patient get",data : data });
  })();
  
}catch(err){
  return res.status(400).json({error : err})
}
  
}

/////
exports.DeletPatient = async (req ,res) =>{
  try{
      let {passManager , user ,listOfTheDeletedObejcts}  = req.body
      const extractedKey = user.slice(4, 4 + 9);
      const originalEncryptedInfo = user.slice(0, 4) + user.slice( 4 + 9);
      const decryptedInfo =  Aes.Ctr.decrypt(originalEncryptedInfo, extractedKey,256);
      console.log(decryptedInfo)
      let email = decryptedInfo.email
      passManager = Key.hmacSHA256(passManager).toString('hex');
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
                if (user.passManager) {
                  userPassword = user.passManager;
                  break;
                }
                await client.close();
              }
              
              if (!userPassword) {
                return res.status(400).json({ error: "Password not found for this account" });
              }

              if(userPassword !== passManager){
                return res.status(400).json({ error: "Password is incorrect" });
              }
              // Étape 2 : supprimé des objets
              for(matricule of listOfTheDeletedObejcts){
                 await deleteData(matricule);
              }
              return res.status(200).json({message : "les Patient delete with succes "})
  }catch(err){
    console.log(err)
    return res.status(400).json({error : err.message })
  }
}
////////
exports.findPatient = async (req,res) =>{
  try{
    let matricule = req.body.data 
    const patient = await findData(matricule)
    console.log(patient)
    return res.status(200).json({patient : patient })
  }catch(err){
    return res.status(400).json({error : err.message})
  }
}

exports.UpdatePatients = async (req,res) => {
  try{
    let matricule = req.body.matricule
    let data1 = req.body.data
    const data = await  removeDynamicKeys(data1);
    const simple_data =  await transformToSampleDossier(data)
    console.log("data patient avant ",simple_data)
    const patient = await modifyData(matricule,simple_data)
    console.log("patient apres :  ",patient)
    res.status(200).json({message : "Pateint update withe succes", patient : patient})
  }catch(err){
    res.status(400).json({err : err.message})
  }
}


exports.SerchPatients = async (req,res) => {
  try{
    let Patients
     const data = req.body
     console.log("data liwslet :" ,data)
     if(data.matricule){
       Patients = await findData(data.matricule)
     }else{
     if(data.patientName ){
       Patients = await RechercheNom(data.patientName)
       if(data.diagnosis){
        Patients = await RechercheDiagnosis(data.diagnosis,Patients.matricules )
        if(data.etat) Patients = await RechercheFileStatus(data.etat ,Patients.matricules)
       }else if(data.etat) Patients = await RechercheFileStatus(data.etat ,Patients.matricules)
     }else{
      if(data.diagnosis){
        Patients = await RechercheDiagnosis(data.diagnosis)
        if(data.etat) Patients = await RechercheFileStatus(data.etat ,Patients.matricules)
       }else if(data.etat) {Patients = await RechercheFileStatus(data.etat)} else {
      // reprendre tout les donner dans ce cas 
        (async () => {
          const matricules = await getLastMatricules();
            Patients = await getLatestData(matricules);
          return res.status(200).json({ message: "Patient get", Patients : Patients });
        })();
      }
     }
    }
    return res.status(200).json({ message: "Patient get", Patients : Patients });
  }catch(err){
    res.status(400).json({err : err.message})
  }
}