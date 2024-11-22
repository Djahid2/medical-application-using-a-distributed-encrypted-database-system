const Aes = require('../modules/aes.js'); // Import AES functionality
require('../modules/aesCTR.js'); 
const Hash = require("../modules/key.js");
const crypto = require("crypto");


// Example Usage
const password = "securepassword"; // Input password
const salt = crypto.randomBytes(16); // Génération du sel aléatoire (16 bytes)
const iterations = 1000; // PBKDF2 iterations
const keySize = 32; // AES-256 requires a 32-byte key

// Generate a 32-byte key using PBKDF2
const key = Hash.generateKey(password,salt, iterations, keySize);

// Generate a random initialization vector (IV)
const iv = new Uint8Array(16); // AES-CTR uses a 16-byte IV
crypto.getRandomValues(iv); // Populate IV with random bytes

// Data to encrypt
const plaintext = "Hello, this is a secret message!";

// Encrypt the data using your custom Aes.Ctr.encrypt function
const encryptedData = Aes.Ctr.encrypt(plaintext, key, 256);
console.log("Encrypted Data:", encryptedData);

// Decrypt the data using your custom Aes.Ctr.decrypt function
const decryptedData = Aes.Ctr.decrypt(encryptedData, key, 256);
console.log("Decrypted Data:", decryptedData);
