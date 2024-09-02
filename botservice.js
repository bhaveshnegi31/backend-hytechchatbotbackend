const { ActivityHandler, MessageFactory } = require("botbuilder");
const { getChatCompletion } = require("./openaiservice");
const { searchDocuments } = require("./searchService");
const { getembeddingdata } = require("./textembeddingservice");
const { translateText, detectLanguage } = require("./textranslation");

class MyBot extends ActivityHandler {
  constructor() {
    super();

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      const welcomeText = "Welcome to the bot! How can I assist you today?";

      for (let member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
        }
      }

      await next();
    });

    this.onMessage(async (context, next) => {
      try {
        let userMessage = context.activity.text;

        // Detect the user's language
        const userLanguage = await detectLanguage(userMessage);

        // If the message is not in English, translate it to English
        const translatedMessage = userLanguage !== "en" ? await translateText(userMessage, userLanguage, "en") : userMessage;

        // Get the chat completion in English
        const results = await getChatCompletion(translatedMessage);
        let replyText = "";

        if (results) {
          // Translate the response back to the user's language if necessary
          replyText = userLanguage !== "en" ? await translateText(results, "en", userLanguage) : results;
        } else {
          replyText = "Sorry, I couldn't find any relevant information.";
        }

        await context.sendActivity(MessageFactory.text(replyText, replyText));
      } catch (error) {
        console.log("Error:", error);
        await context.sendActivity("Sorry, there was an error processing your request.");
      }

      await next();
    });
  }
}

module.exports.MyBot = MyBot;
