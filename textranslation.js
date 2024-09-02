const TextTranslationClient = require("@azure-rest/ai-translation-text").default;
require('dotenv').config();

const apiKey = process.env.TranslatorApiKey;
const endpoint = process.env.TranslatorEndPoint;
const region = "uksouth";

const translationClient = new TextTranslationClient(endpoint, {
  key: apiKey,
  region, 
});

async function translateText(text, from = "en", to = "fr") {
  try {
    const inputText = [{ text }];
    const translateResponse = await translationClient.path("/translate").post({
      body: inputText,
      queryParameters: { to, from },
    });

    const translations = translateResponse.body;
    let translatedText = "";
    for (const translation of translations) {
      translatedText += translation?.translations[0]?.text;
    }
    return translatedText;
  } catch (err) {
    console.error("An error occurred during translation:", err);
    throw err;
  }
}

async function detectLanguage(text) {
  try {
    const detectResponse = await translationClient.path("/detect").post({
      body: [{ text }],
    });

    const detectedLanguages = detectResponse.body;
    return detectedLanguages[0]?.language || "en";
  } catch (err) {
    console.error("An error occurred during language detection:", err);
    throw err;
  }
}
module.exports = { translateText, detectLanguage };
