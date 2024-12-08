const Aes = require('../modules/aes.js'); // Import AES functionality
require('../modules/aesCTR.js');          // Load AES CTR extension

/* @example*/
const plaintext = '[{"symptom":"Fatigue","onset":"2021-05-01"}]';
var encr = Aes.Ctr.encrypt(plaintext, 'bI9Kè+_zr', 256); 
console.log("message chiffre: ",encr);
/* @example */
var decr = Aes.Ctr.decrypt("VQBwE7fbVGe7OdXtqFU5yhDRgfU/5rH+dg+bzcQkm5+eoPEzNxdXxFuhZX1lYfWW9iuRmPNDZgjmxkGAX9Py/scFzFV7Hqc=","&jc9D8u-(" , 256);
console.log("message dechiffre: ",decr);
