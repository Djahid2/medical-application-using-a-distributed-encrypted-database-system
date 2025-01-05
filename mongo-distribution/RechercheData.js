const { MongoClient } = require("mongodb");
const Key = require("./crypto/modules/key");
const { extract_positions, RevealKey } = require('./crypto/modules/extract_positions.js');
require('./crypto/modules/aesCTR.js'); 
const Aes = require('./crypto/modules/aes.js');
const { getLastMatricules } = require('./GetLastMat.js');
const { getLatestData } = require('./FindData.js');

const NODE_URIS = [
  "mongodb://localhost:27018/dossier_medical",
  "mongodb://localhost:27019/dossier_medical",
  "mongodb://localhost:27020/dossier_medical",
  "mongodb://localhost:27021/dossier_medical",
];

async function RechercheNom(Nom) {
  const matricules = await getLastMatricules();
  const dataList = await getLatestData(matricules);
  console.log("Fetched data:", dataList);

  // Filter the data to match the provided name (case-insensitive, contains)
  const filteredData = dataList.filter(data => 
    data.nom_patient && data.nom_patient.toLowerCase().includes(Nom.toLowerCase())
  );

  const result = {
    count: filteredData.length,
    data : filteredData,
  };

  if (result.count > 0) {
    console.log(`Found ${result.count} matches for name '${Nom}':`, result.data.map(data => data.matricule));
  } else {
    console.log(`No matches found for name '${Nom}'.`);
  }

  return result;
}

// Example usage
/*
RechercheNom("Abdou").then(result => {
  console.log("number of results : "+result.count);
  console.log("results : "+result.matricules);
});
*/

async function RechercheDiagnosis(Diagnosis, matricules = []) {
  try {
    // Check if matricules is empty
    if (matricules.length === 0) {
      matricules = await getLastMatricules();
    }

    // Fetch latest data for the provided matricules
    const dataList = await getLatestData(matricules);
    console.log("Fetched data:", dataList);

    // Filter the data to match the provided Diagnosis
    const filteredData = dataList.filter(data => 
      data.diagnosis &&
      Array.isArray(data.diagnosis) &&
      data.diagnosis.some(diag => diag.toLowerCase().includes(Diagnosis.toLowerCase()))
    );

    // Construct the result object
    const result = {
      count: filteredData.length,
      data : filteredData,
    };

    // Log results
    if (result.count > 0) {
      console.log(`Found ${result.count} matches for Diagnosis '${Diagnosis}':`, result.data.map(data => data.matricule));
    } else {
      console.log(`No matches found for Diagnosis '${Diagnosis}'.`);
    }

    return result;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

// Example usage
/*
RechercheNom("Abdou").then(nameResult => {
  const nameMatricules = nameResult.matricules; 
  return RechercheDiagnosis("cancer", nameMatricules);
}).then(diagnosisResult => {
  console.log(`Number of elements found: ${diagnosisResult.count}`);
  console.log("Matricules of matching elements:", diagnosisResult.matricules);
}).catch(error => {
  console.error("An error occurred:", error);
});

*/

async function RechercheFileStatus(etat, matricules = []) {
  try {
    // Check if matricules is empty
    if (matricules.length === 0) {
      matricules = await getLastMatricules();
    }

    // Fetch latest data for the provided matricules
    const dataList = await getLatestData(matricules);
    console.log("Fetched data:", dataList);

    // Filter the data to match the provided Diagnosis
    const filteredData = dataList.filter(data => 
      data.etat && data.etat.toLowerCase().includes(etat.toLowerCase())
    );
    

    // Construct the result object
    const result = {
      count: filteredData.length,
      data : filteredData,

    };

    // Log results
    if (result.count > 0) {
      console.log(`Found ${result.count} matches for etat '${etat}':`, result.data.map(data => data.matricule));
    } else {
      console.log(`No matches found for etat '${etat}'.`);
    }

    return result;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}
/*
RechercheNom("Abdou").then(nameResult => {
  const nameMatricules = nameResult.data.map(data => data.matricule); 
    return RechercheDiagnosis("cancer", nameMatricules);
}).then(diagnosisResult => {
  const diagnosisMatricules = diagnosisResult.data.map(data => data.matricule); 

  return RechercheFileStatus("inactive", diagnosisMatricules);
}).then(fileStatusResult => {
  console.log(`Number of elements found: ${fileStatusResult.count}`);
  console.log("Matricules of matching elements:", fileStatusResult.data);
}).catch(error => {
  console.error("An error occurred:", error);
});
*/
async function RechercheDateAppointment(date, matricules = []) {
  try {
    // Check if matricules is empty
    if (matricules.length === 0) {
      matricules = await getLastMatricules();
    }

    // Fetch latest data for the provided matricules
    const dataList = await getLatestData(matricules);
    console.log("Fetched data:", dataList);

    // Filter the data to match the provided Diagnosis
    const filteredData = dataList.filter(data => {
      const appointmentDate = data.next_appointment_date ? data.next_appointment_date.split('T')[0] : '';
      return appointmentDate === date;
    });
    

    // Construct the result object
    const result = {
      count: filteredData.length,
      data : filteredData,

    };

    // Log results
    if (result.count > 0) {
      console.log(`Found ${result.count} matches for date '${date}':`, result.data.map(data => data.matricule));
    } else {
      console.log(`No matches found for etat '${date}'.`);
    }

    return result;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
}

module.exports = {RechercheFileStatus,RechercheDiagnosis,RechercheNom,RechercheDateAppointment}