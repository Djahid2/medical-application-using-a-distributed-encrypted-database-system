const { MongoClient } = require("mongodb");
const Key = require("../crypto/modules/key");
require('../crypto/modules/aesCTR.js'); 
const Aes = require('../crypto/modules/aes.js');
const { extract_positions, HideKey,generateRandomKey } = require('../crypto/modules/extract_positions.js');
const {getLastMatricule} = require('./GetLastMat.js');

const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

const sampleDossier = {
  file_status: "active",
  emergency_contact: JSON.stringify({ name: "John Doe", relation: "Brother", phone: "123-456-7890" }),
  insurance_details: JSON.stringify({ provider: "HealthCare Inc.", policy_number: "POL123456" }),
  medical_history: JSON.stringify([{ illness: "Hypertension", date: "2021-05-10" }]),
  diagnoses: JSON.stringify([{ diagnosis: "Diabetes", severity: "Moderate", date: "2021-06-15" }]), 
  allergies: "Peanuts, Shellfish",
  medications: JSON.stringify([{ name: "Metformin", dosage: "500mg", frequency: "twice daily" }]),
  treatments: JSON.stringify([{ type: "Physiotherapy", date: "2021-07-01", notes: "Weekly sessions" }]),
  lab_results: JSON.stringify([{ test: "Blood Sugar", date: "2021-06-15", result: "150 mg/dL" }]),
  doctor_notes: "Patient is responding well to treatment.",
  symptoms: JSON.stringify([{ name: "Fatigue", onset: "2021-05-01" }]),
  vital_signs: JSON.stringify({ blood_pressure: "120/80", temperature: "98.6F" }),
  next_appointment_date: "2021-08-15T09:30:00Z", 
  date_naissance_patient: "2000-06-10",
  nom_patient:"Nom Prenom", 
};



function distributeRandomlyWithEncryption(data) {
  const keys = Object.keys(data);
  const nodeData = Array.from({ length: NODE_URIS.length }, () => ({}));
  const randomKey = generateRandomKey();
  console.log(randomKey)
  while (keys.length > 0) {
    for (let i = 0; i < NODE_URIS.length && keys.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * keys.length);
      const key = keys.splice(randomIndex, 1)[0];
      const encryptedValue = Aes.Ctr.encrypt(data[key], randomKey, 256);
      nodeData[i][key] = encryptedValue;
    }
  }

  return { nodeData, randomKey };
}

async function distributeData(data) {
  const maxMatricule = await getLastMatricule(); 
  const newMatricule = maxMatricule + 1; // Calculate the new matricule
  const HashedId = Key.hmacSHA256(newMatricule.toString()).toString("hex"); // Generate the hashed ID
  const newData = { ...data, patient_matricule: newMatricule.toString() }; // Add the matricule to the data

  // Step 1: Distribute data with encryption
  const { nodeData, randomKey } = distributeRandomlyWithEncryption(newData);

  console.log("Node data with encryption:", nodeData);
  console.log("Random encryption key:", randomKey);

  // Step 2: Extract positions from the hashed ID
  const positions = extract_positions(HashedId);

  // Step 3: Define variables to store the fields across all nodes
  let emergencyContact = '';
  let patientMatricule = '';
  let labResults = '';

  // Step 4: Iterate through all nodes to find the required attributes
  for (let index = 0; index < nodeData.length; index++) {
    const node = nodeData[index];

    if (node.emergency_contact) {
      emergencyContact = node.emergency_contact;
    }
    if (node.patient_matricule) {
      patientMatricule = node.patient_matricule;
    }
    if (node.lab_results) {
      labResults = node.lab_results;
    }
  }

  console.log("Retrieved fields from all nodes:");
  console.log("Emergency Contact:", emergencyContact);
  console.log("Patient Matricule:", patientMatricule);
  console.log("Lab Results:", labResults);

  // Step 5: Ensure all required fields are found
  if (!emergencyContact || !patientMatricule || !labResults) {
    console.error("One or more required fields are missing!");
    return;
  }

  // Step 6: Hide the encryption key inside the fields
  const hiddenKeyStrings = HideKey(randomKey, positions, emergencyContact, patientMatricule, labResults);
  console.log("Hidden Key Strings:", hiddenKeyStrings);

  // Step 7: Iterate through the nodes again and update the attributes with the hidden keys
  for (let index = 0; index < nodeData.length; index++) {
    const node = nodeData[index];

    if (node.emergency_contact) {
      node.emergency_contact = hiddenKeyStrings[0];
    }
    if (node.patient_matricule) {
      node.patient_matricule = hiddenKeyStrings[1];
    }
    if (node.lab_results) {
      node.lab_results = hiddenKeyStrings[2];
    }
  }
  // Distribute the encrypted data across the nodes
  for (let i = 0; i < NODE_URIS.length; i++) {
    const client = new MongoClient(NODE_URIS[i]);
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("dossier_medical");

      // Update each node with the hashed ID before inserting into the DB
      nodeData[i]._id = HashedId; // Add the hashed ID to each node's data
      await collection.insertOne(nodeData[i]); // Insert the data into the database
    } finally {
      await client.close();
    }
  }

  console.log(`Data distributed with matricule ${newMatricule}`);
  console.log(`Key hidden at positions ${positions.join(", ")} in the attributes: emergency_contact, patient_matricule, and lab_results`);
}


async function main() {
  let i = 0;
  while (i<=35){
  await distributeData(sampleDossier);
  console.log("Data distribution complete!");
    i++;
}
}

main().catch(console.error);
