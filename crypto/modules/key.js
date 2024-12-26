var Key = {};

Key.sha256 = function (data) {
  // Encodage de données sous forme binaire
  const encodedData = new TextEncoder().encode(data);
  
  // Initialisation des constantes simplifiées SHA-256
  const hash = new Uint32Array(8);
  for (let i = 0; i < 8; i++) hash[i] = 0x6a09e667 + i * 0x510e527f; // Valeurs arbitraires
  
  // Effectuer des transformations (simplifiées pour cet exemple)
  for (let i = 0; i < encodedData.length; i++) {
    const j = i % 8;
    hash[j] = (hash[j] + encodedData[i] * (i + 1)) >>> 0;
  }
  
  // Retourner le hash sous forme de Buffer
  const result = new Uint8Array(hash.buffer);
  return result;
};

// Fonction manuelle HMAC-SHA256
Key.hmacSHA256 = function (data) {
  const key= "secretkey" ;
  if (typeof data === "string") data = new TextEncoder().encode(data);

  const blockSize = 64; // Taille du bloc pour SHA-256
  let paddedKey = key;

  // Si la clé est plus grande que le bloc, la hacher
  if (key.length > blockSize) {
    paddedKey = Key.sha256(key);
  }

  // Compléter la clé pour atteindre la taille de 64 octets
  if (paddedKey.length < blockSize) {
    const temp = new Uint8Array(blockSize);
    temp.set(paddedKey);
    paddedKey = temp;
  }

  // Calculer les paddings
  const oKeyPad = new Uint8Array(blockSize);
  const iKeyPad = new Uint8Array(blockSize);

  for (let i = 0; i < blockSize; i++) {
    oKeyPad[i] = paddedKey[i] ^ 0x5c;
    iKeyPad[i] = paddedKey[i] ^ 0x36;
  }

  // HMAC-SHA256
  const innerHash = Key.sha256(new Uint8Array([...iKeyPad, ...data]));
  const hmac = Key.sha256(new Uint8Array([...oKeyPad, ...innerHash]));

  return Array.from(hmac).map(byte => byte.toString(16).padStart(2, "0")).join("");
};

/*


const crypto = require("crypto");
var Key = {};
// Fonction pour calculer un HMAC-SHA256
Key.hmacSHA256 = function (data) {
  var key="secretkey"
  // Convertir key et data en Buffer si ce ne sont pas déjà des Buffers
  if (typeof key === "string") key = Buffer.from(key, "utf-8");
  if (typeof data === "string") data = Buffer.from(data, "utf-8");

  const blockSize = 64; // Taille du bloc pour SHA-256
  let paddedKey = key;

  // Si la clé est plus grande que le bloc, la hacher
  if (key.length > blockSize) {
    paddedKey = crypto.createHash("sha256").update(key).digest();
  }

  // Compléter la clé pour atteindre la taille de 64 octets
  if (paddedKey.length < blockSize) {
    paddedKey = Buffer.concat([paddedKey, Buffer.alloc(blockSize - paddedKey.length)]);
  }

  // Calculer les paddings
  const oKeyPad = Buffer.alloc(blockSize, 0x5c).map((b, i) => b ^ paddedKey[i]);
  const iKeyPad = Buffer.alloc(blockSize, 0x36).map((b, i) => b ^ paddedKey[i]);

  // HMAC-SHA256
  const innerHash = crypto.createHash("sha256").update(Buffer.concat([iKeyPad, data])).digest();
  return crypto.createHash("sha256").update(Buffer.concat([oKeyPad, innerHash])).digest();
}

// Fonction PBKDF2 manuelle
Key.pbkdf2 = function (password, salt, iterations, keyLength) {
  const passwordBuffer = Buffer.from(password, "utf-8");
  const saltBuffer = Buffer.from(salt, "utf-8");

  const blocks = Math.ceil(keyLength / 32); // SHA-256 produit 32 octets
  let derivedKey = Buffer.alloc(0);

  for (let block = 1; block <= blocks; block++) {
    const blockIndex = Buffer.alloc(4);
    blockIndex.writeUInt32BE(block, 0);

    // Initialisation de U1
    let u = Key.hmacSHA256(passwordBuffer, Buffer.concat([saltBuffer, blockIndex]));

    // Accumuler U1
    let result = u;

    // Calculer U2 à Uc
    for (let i = 1; i < iterations; i++) {
      u = Key.hmacSHA256(passwordBuffer, u);
      result = Buffer.from(result.map((b, j) => b ^ u[j]));
    }

    derivedKey = Buffer.concat([derivedKey, result]);
  }

  return derivedKey.slice(0, keyLength);
}


// Fonction pour générer une clé à partir d'un mot de passe
Key.generateKey = function (password, salt, iterations = 1000, keySize = 32) {
  return Key.pbkdf2(password, salt, iterations, keySize);
}

if (typeof module != 'undefined' && module.exports) module.exports = Key; 

/**--------------------------------CHIFFREMENT/DECHIFFREMENT------------------------------- 


// Fonction pour chiffrer les données avec AES et PBKDF2
Key.encryptAESWithPBKDF2 = function (data, password) {
  const salt = crypto.randomBytes(16); // Génération du sel aléatoire (16 bytes)
  const iv = crypto.randomBytes(16);   // Génération de l'IV aléatoire (16 bytes)
  const key = Key.generateKey(password, salt.toString("utf-8")); // Génération de la clé avec PBKDF2

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv); // Mode AES-256-CBC
  let encrypted = cipher.update(
    typeof data === "string" ? data : JSON.stringify(data), 
    "utf8", 
    "base64"
  );
  encrypted += cipher.final("base64");

  return {
    ciphertext: encrypted,
    salt: salt.toString("hex"),
    iv: iv.toString("hex"),
  };
}

// Fonction pour déchiffrer les données avec AES et PBKDF2
Key.decryptAESWithPBKDF2 = function (encryptedData, password) {
  const { ciphertext, salt, iv } = encryptedData;

  const saltBuffer = Buffer.from(salt, "hex");
  const ivBuffer = Buffer.from(iv, "hex");

  const key = Key.generateKey(password, saltBuffer.toString("utf-8")); // Générer la clé avec PBKDF2

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);
  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");

  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
}

*/
module.exports =  Key ;


