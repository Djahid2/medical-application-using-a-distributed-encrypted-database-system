const Aes = require('../modules/aes.js'); // Import AES functionality
require('../modules/aesCTR.js');          // Load AES CTR extension

/* @example*/
const plaintext = '[{"symptom":"Fatigue","onset":"2021-05-01"}]';
var encr = Aes.Ctr.encrypt(plaintext, 'bI9Kè+_zr', 256); 
console.log("message chiffre: ",encr);
/* @example */
var decr = Aes.Ctr.decrypt("1wN6GTK4WWcdvZS7DN8AE9aNTdBdhBoP0doCLqbWFFL10vip/PChv6zuEafUixPdvJANpQ","bI9Kè+_zr" , 256);
console.log("message dechiffre: ",decr);
