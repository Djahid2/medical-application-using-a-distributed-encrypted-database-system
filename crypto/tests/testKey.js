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

console.log("Le Hach du mot Hello :", Key.hmacSHA256(data1).toString("hex"));
console.log("Le Hach du mot Hellojsdnjejfekzlejk :", Key.hmacSHA256("Hellojsdnjejfekzlejk").toString("hex"));
console.log("Le Hach du mot a :", Key.hmacSHA256("a").toString("hex"));
