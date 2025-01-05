
const {extract_positions,HideKey,RevealKey} = require("../modules/extract_positions");
   // Example usage:
const hashedMessage = "ab6f654cb1d847da6cc007a6affc9ed793f58f75763dd42f671ed32f0513a64c";

  // Example usage
const key = "abcdefghi";
const positions = extract_positions(hashedMessage);
const string1 = '[{"test":"Blood Sugar","date":"2021-06-15","result":"150 mg/dL"}]';
const string2 = "Patient is responding well to treatment";
const string3 = '["https://example.com/consent-form-1","https://example.com/consent-form-2"]';

const results = HideKey(key, positions, string1, string2, string3);
console.log("Extracted Positions:", positions);

console.log("Results:", results);

const stringkey1 = results[0];
const stringkey2 = results[1];
const stringkey3 = results[2];

const extractionResult = RevealKey(positions, stringkey1, stringkey2, stringkey3);

console.log("Modified Strings:", extractionResult.modifiedStrings); 
console.log("Extracted Key:", extractionResult.key);