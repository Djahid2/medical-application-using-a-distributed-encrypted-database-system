function extract_positions(hashedMessage) {
    if (typeof hashedMessage !== "string" || hashedMessage.length !== 64) {
      throw new Error("Invalid hash: Must be a 64-character hexadecimal string.");
    }
  
    // Split the hash into sections and convert to integers
    const int1 = (parseInt(hashedMessage.slice(0, 16), 16) % 20) + 1;  // First 16 characters
    const int2 = (parseInt(hashedMessage.slice(16, 32), 16) % 20) + 1; // Next 16 characters
    const int3 = (parseInt(hashedMessage.slice(32, 48), 16) % 20) + 1; // Take another 16 characters
  
    // Ensure the integers are positive by using the modulo operation
    return [int1, int2, int3];
  }

function HideKey(key, positions, string1, string2, string3) {
    if (key.length !== 9 || positions.length !== 3) {
        throw new Error("Invalid input: Key must be 9 characters and positions must contain 3 integers.");
    }

    // Split the key into three parts
    const key1 = key.slice(0, 3);
    const key2 = key.slice(3, 6);
    const key3 = key.slice(6, 9);

    // Helper function to insert a substring into a string at a specified position
    function insertAt(string, insert, position) {
        return string.slice(0, position) + insert + string.slice(position);
    }

    // Insert the key parts at the specified positions
    const result1 = insertAt(string1, key1, positions[0]);
    const result2 = insertAt(string2, key2, positions[1]);
    const result3 = insertAt(string3, key3, positions[2]);

    // Return the modified strings as an array
    return [result1, result2, result3];
}

function RevealKey(positions, string1, string2, string3) {
    if (positions.length !== 3) {
        throw new Error("Invalid input: Positions must contain 3 integers.");
    }

    // Helper function to remove a substring from a string at a specified position
    function extractAndRemove(string, position, length) {
        const extracted = string.slice(position, position + length); // Extract the key
        const modifiedString = string.slice(0, position) + string.slice(position + length); // Remove the key
        return { extracted, modifiedString };
    }

    // Extract the keys from the strings
    const { extracted: key1, modifiedString: modifiedString1 } = extractAndRemove(string1, positions[0], 3);
    const { extracted: key2, modifiedString: modifiedString2 } = extractAndRemove(string2, positions[1], 3);
    const { extracted: key3, modifiedString: modifiedString3 } = extractAndRemove(string3, positions[2], 3);

    // Reconstruct the full key
    const key = key1 + key2 + key3;

    // Return the modified strings and the key
    return {
        modifiedStrings: [modifiedString1, modifiedString2, modifiedString3],
        key,
    };
}

if (typeof module != 'undefined' && module.exports){

    module.exports = {
        extract_positions: extract_positions,
        HideKey: HideKey,
        RevealKey: RevealKey
      };
}
