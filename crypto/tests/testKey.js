const Key = require("../modules/key");


// Exemple d'utilisation
const password = "my-secure-password";
const data = { message: "Données sensibles", date: new Date().toISOString() };
//const data = "Hello World !";

// Exemple d'utilisation
const key1 = Buffer.from(["my-secure-password"]); // Clé en tant que Buffer
const data1 = "Hello"; // Données en tant que chaîne

console.log("Le Hach du mot Hello :",Key.hmacSHA256("Hello").toString("hex"));
console.log("Le Hach du mot Hellojsdnjejfekzlejk :", Key.hmacSHA256("Hellojsdnjejfekzlejk").toString("hex"));
console.log("Le Hach du mot a :", Key.hmacSHA256("a").toString("hex"));
