const crypto = require('crypto');
const Aes = require('../modules/aes.js');
require('../modules/aesCTR.js');
const Key = require('../modules/key.js');



/**Key derivation with hash.js */
const password = 'superpassword'; // Replace with user input or a securely stored password
const salt = crypto.randomBytes(16); // Génération du sel aléatoire (16 bytes) // Use a unique salt for each encryption
const iterations = 1000; // Increase for stronger key derivation
const keySize = 32; // AES-256 requires 32 bytes
//const keySize = 16; // AES-256 requires 32 bytes


const key = Key.generateKey(password, salt, iterations, keySize);
console.log('Derived Key:', key.toString('hex'));



/**Encrypt data with aesCTR.js */

const data = { message: "Données sensibles", date: new Date().toISOString() };

//const plaintext = 'This is a secret message!';
const nBits = 256; // AES-256 encryption

// Convert key into a password string (if needed) or use directly
//const passwordKey = key.toString('utf-8'); 

// Convert data to JSON string
const dataString = JSON.stringify(data);

const ciphertext = Aes.Ctr.encrypt(dataString, key, nBits);
console.log('Encrypted:', ciphertext);




/**Decrypt data with aesCTR.js */

const decryptedText = Aes.Ctr.decrypt(ciphertext, key, nBits);
console.log('Decrypted:', decryptedText);

