const { MongoClient } = require("mongodb");

const NODE_URIS = [
  "mongodb://localhost:27017/dossier_medical",
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
];

const sampleDossier = {
  patient_matricule: "12345",
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

async function distributeData(data) {
  const distributedData = distributeRandomly(data);

  for (let i = 0; i < NODE_URIS.length; i++) {
    const client = new MongoClient(NODE_URIS[i]);
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection("dossier_medical");
      await collection.insertOne(distributedData[i]);
    } finally {
      await client.close();
    }
  }
}

async function main() {
  await distributeData(sampleDossier);
  console.log("Data distribution complete!");
}

main().catch(console.error);
