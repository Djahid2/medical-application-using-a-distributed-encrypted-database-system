const { MongoClient } = require("mongodb");
const Key = require("../crypto/modules/key");

const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

async function deleteData(matricule) {
    let totalDeletedCount = 0;
    const matriculeHashed = Key.hmacSHA256(matricule.toString()).toString("hex");
    for (const uri of NODE_URIS) {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db();
        const collection = db.collection("dossier_medical");
        const result = await collection.deleteOne({ _id: matriculeHashed });
  
        if (result.deletedCount > 0) {
          totalDeletedCount += result.deletedCount;
          console.log(`Deleted from database at ${uri}`);
        } else {
          console.log(`No record found in database at ${uri}`);
        }
      } catch (err) {
        console.error(`Error connecting to ${uri}:`, err.message);
      } finally {
        await client.close();
      }
    }
  
    if (totalDeletedCount > 0) {
      console.log(`Successfully deleted ${totalDeletedCount} records for matricule ${matricule}.`);
    } else {
      console.log(`No records found for matricule ${matricule} in any database.`);
    }
  
    return totalDeletedCount;
  }

 
for (let matricule = 20241631027; matricule <= 20241631047; matricule++) {
  deleteData(matricule);
  console.log(`Deleted matricule: ${matricule}`);
}
