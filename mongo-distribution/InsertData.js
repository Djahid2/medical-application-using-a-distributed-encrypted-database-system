const { MongoClient } = require("mongodb");

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
  symptoms: JSON.stringify([{ symptom: "Fatigue", onset: "2021-05-01" }]),
  vital_signs: JSON.stringify({ blood_pressure: "120/80", temperature: "98.6F" }),
  next_appointment_date: "2021-08-15T09:30:00Z",
  billing_information: JSON.stringify({ total_cost: 1000, paid_amount: 500, due_balance: 500 }),
  consent_forms: JSON.stringify(["https://example.com/consent-form-1", "https://example.com/consent-form-2"]),
};

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

async function getMaxMatricule() {
  let maxMatricule = 20241631000; // Default starting matricule

  for (const uri of NODE_URIS) {
    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("dossier_medical");

      const latestDoc = await collection.find().sort({ patient_matricule: -1 }).limit(1).toArray();

      if (latestDoc.length > 0 && latestDoc[0].patient_matricule) {
        const matricule = parseInt(latestDoc[0].patient_matricule, 10);
        if (matricule > maxMatricule) {
          maxMatricule = matricule;
        }
      }
    } finally {
      await client.close();
    }
  }

  return maxMatricule;
}


async function distributeData(data) {
  const maxMatricule = await getMaxMatricule(); // Get the current max matricule
  const newMatricule = maxMatricule + 1; // Calculate the new matricule
  const newId = newMatricule + 10000; // Generate the new ID
  const newData = { ...data, patient_matricule: newMatricule.toString() };

  const distributedData = distributeRandomly(newData);
  for (let i = 0; i < NODE_URIS.length; i++) {
    const client = new MongoClient(NODE_URIS[i]);
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("dossier_medical");
      distributedData[i]._id = newId.toString();
      await collection.insertOne(distributedData[i]);
    } finally {
      await client.close();
    }
  }

  console.log(`Data distributed with matricule ${newMatricule}`);
}

async function main() {
  await distributeData(sampleDossier);
  console.log("Data distribution complete!");
}

main().catch(console.error);
