const Key = require("../modules/key");


// Exemple d'utilisation
const password = "my-secure-password";
const data = { message: "Données sensibles", date: new Date().toISOString() };
//const data = "Hello World !";

// Chiffrement
const encrypted = Key.encryptAESWithPBKDF2(data, password);
console.log("Données chiffrées :", encrypted.ciphertext);

// Déchiffrement
const decrypted = Key.decryptAESWithPBKDF2(encrypted, password);
console.log("Données déchiffrées :", decrypted);
console.log("Données déchiffrées :", decrypted.message);
console.log("Données déchiffrées :", decrypted.date);


// Exemple d'utilisation
const key1 = Buffer.from(["my-secure-password"]); // Clé en tant que Buffer
const data1 = "Hello"; // Données en tant que chaîne

console.log("Le Hach du mot Hello :", Key.hmacSHA256(key1, data1).toString("hex"));
console.log("Le Hach du mot Hellojsdnjejfekzlejk :", Key.hmacSHA256(key1, "Hellojsdnjejfekzlejk").toString("hex"));



b4d6720e5dbca77f5108a6e2e9c4d0a77a732f64244bdfdf01a3ede8ff933e00
d5098bc9362a2b4a200b4d121f2da317d9c0fa5fdb598277b2aad1ee9a022cb2