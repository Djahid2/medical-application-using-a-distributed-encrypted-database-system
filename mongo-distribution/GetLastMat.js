const { MongoClient } = require("mongodb");
require('../crypto/modules/aesCTR.js'); 
const Aes = require('../crypto/modules/aes.js');
const { extract_positions, RevealKey } = require('../crypto/modules/extract_positions.js');


const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

async function getLastMatricule() {
    let latestDetails = {
      _id : null,
      patient_matricule: null,
      emergency_contact: null,
      lab_results: null,
    };
  
    // Loop over each database URI
    for (const uri of NODE_URIS) {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db();
        const collection = db.collection("dossier_medical");
  
        // Use find() to get a cursor, and then reverse the iteration (get last inserted)
        const cursor = collection.find({});
        let lastDoc = null;
  
        // Iterate through the cursor and get the last document
        await cursor.forEach(doc => {
          lastDoc = doc; // The last document found in the iteration
        });
  
        // If a document is found, get the encrypted values
        if (lastDoc) {
        
          latestDetails._id = lastDoc._id || latestDetails._id;
          latestDetails.patient_matricule = lastDoc.patient_matricule || latestDetails.patient_matricule;
          latestDetails.emergency_contact = lastDoc.emergency_contact || latestDetails.emergency_contact;
          latestDetails.lab_results = lastDoc.lab_results || latestDetails.lab_results;
        }
      } catch (err) {
        console.error(`Error connecting to ${uri}:`, err.message);
      } finally {
        await client.close();
      }
    }
    if (!latestDetails.patient_matricule) {
        console.log("No matricule found. Defaulting to 20241631000.");
        return 20241631000;
      }
        const positions = extract_positions(latestDetails._id);
        const { modifiedStrings, key } = RevealKey(positions, latestDetails.emergency_contact, latestDetails.patient_matricule, latestDetails.lab_results);
        const matricule = Aes.Ctr.decrypt(modifiedStrings[1], key, 256);
    return parseInt(matricule);
  }
  
async function getLastMatricules() {
    let matriculeList = [];
    const DecryptedMat = [];
    // Loop through each database URI
    for (const uri of NODE_URIS) {
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db();
            const collection = db.collection("dossier_medical");

            // Use find() to get a cursor (no sorting, to iterate all documents)
            const cursor = collection.find({});

            // Variable to keep track of the position (count) for each matricule
            let position = 1;

            // Iterate through the cursor and get each document
            await cursor.forEach(doc => {
                if (doc && doc.patient_matricule) {
                    // Add the patient matricule and its position to the matriculeList
                    matriculeList.push({
                        _id: doc._id,
                        matricule: doc.patient_matricule,
                        position: position
                    });
                    // Increment the position for the next matricule
                }
                position++;

            });
        } catch (err) {
            console.error(`Error connecting to ${uri}:`, err.message);
        } finally {
            await client.close();
        }
    }

    // Sort the matriculeList based on position (count) to get the last 5 matricules
    matriculeList.sort((a, b) => b.position - a.position);  
    let listDecryptedMat = matriculeList;

    for (const element of listDecryptedMat) {
        const decryptedMatricule = await decryptMatricule(element._id, element.matricule);
        DecryptedMat.push(decryptedMatricule);
    }
    return DecryptedMat;
}
async function getLast50Matricules(offset) {
    const DecryptedMat = [];
    const batchSize = 50; // Number of documents per page
    const skipCount = (offset - 1) * batchSize; // Calculate the number of documents to skip

    for (const uri of NODE_URIS) {
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db();
            const collection = db.collection("dossier_medical");

            // Use $natural to get documents in reverse insertion order
            const cursor = collection
                .find({})
                .sort({ $natural: -1 }) // Fetch documents in reverse insertion order
                .skip(skipCount)  // Skip documents for the offset
                .limit(batchSize); // Limit to 50 documents

            // Iterate through the cursor and decrypt matricules
            for await (const doc of cursor) {
                if (doc && doc.patient_matricule) {
                    const decryptedMatricule = await decryptMatricule(doc._id, doc.patient_matricule);
                    DecryptedMat.push(decryptedMatricule);
                }
            }
        } catch (err) {
            console.error(`Error connecting to ${uri}:`, err.message);
        } finally {
            await client.close();
        }
    }

    return DecryptedMat;
}

async function decryptMatricule(id, matricule) {
    let foundData = null;
    let data = {};

    // Loop through all database URIs
    for (const uri of NODE_URIS) {
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const db = client.db();
            const collection = db.collection("dossier_medical");

            // Search for the document with the specified id
            const partialData = await collection.findOne({ _id: id }, { projection: { emergency_contact: 1, lab_results: 1 } });

            // If data is found, add emergency_contact and lab_results to the `data` object
            if (partialData) {
                if (partialData.emergency_contact) {
                    data.emergency_contact = partialData.emergency_contact;
                }
                if (partialData.lab_results) {
                    data.lab_results = partialData.lab_results;
                }

                // Once both fields are found, no need to continue searching
                if (data.emergency_contact && data.lab_results) {
                    break;  // Stop searching if both fields are found
                }
            }
        } catch (err) {
            console.error(`Error connecting to ${uri}:`, err.message);
        } finally {
            await client.close();
        }
    }

    // After both fields are found, proceed to decrypt the matricule
    if (data.emergency_contact && data.lab_results) {

        const emergency_contact = data.emergency_contact;
        const lab_results = data.lab_results;

        // Extract positions and reveal decryption key
        const positions = extract_positions(id);
        const { modifiedStrings, key } = RevealKey(positions, emergency_contact, matricule, lab_results);

        // Decrypt the matricule
        const decryptedMatricule = Aes.Ctr.decrypt(modifiedStrings[1], key, 256);


        // Store the decrypted matricule and return
        foundData = {
            matricule: decryptedMatricule,
            emergency_contact,
            lab_results,
        };

        // Return the decrypted matricule as an integer
        return parseInt(decryptedMatricule);
    } else {
        console.error("Matricule not found or necessary fields are missing.");
        return null;  // Return null if data isn't found or fields are missing
    }
}

  
module.exports = {getLastMatricule,getLastMatricules,getLast50Matricules};


