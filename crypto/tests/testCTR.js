const Aes = require('../modules/aes.js'); // Import AES functionality
require('../modules/aesCTR.js');          // Load AES CTR extension

/* @example*/
const plaintext = "Hello, this is a secret message!";
var encr = Aes.Ctr.encrypt(plaintext, 'pāşšŵōřđ', 256); // encr: 'lwGl66VVwVObKIr6of8HVqJr'
console.log("message chiffre: ",encr);
/* @example */
var decr = Aes.Ctr.decrypt(encr, 'pāşšŵōřđ', 256); // decr: 'big secret'
console.log("message dechiffre: ",decr);