const restify = require('restify');
const { BotFrameworkAdapter,ConversationState,MemoryStorage,UserState } = require('botbuilder');
const { MyBot } = require('./botservice');
const { searchDocuments } = require('./searchService'); 
const {getChatCompletion} = require('./openaiservice.js');
require('dotenv').config();

const server = restify.createServer(); 
const port = process.env.PORT || 3000;

// Apply the CORS middleware to your server
const cors = require('cors');
server.use(cors());

const adapter = new BotFrameworkAdapter({
  appId:process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword
  // directLineSecret: process.env.DIRECT_LINE_SECRET
}); 
// const MemoryStorage= new MemoryStorage(); 
// const ConversationState=new ConversationState(MemoryStorage);
// const UserState= new UserState(MemoryStorage);

const bot = new MyBot();

server.post('/api/messages', async (req, res) => {
  //console.log(req);
  try {
    await adapter.processActivity(req, res, async (context) => {

     //console.log(context.activity.type,"type h");
      await bot.run(context);
   
      // Example: Call the searchDocuments function after the bot processes the message
      // const query = { 
      //   search: "hii i am faizan khan",
      //   top: 1
      // };

      // const searchResults = await searchDocuments(query);
      // console.log('Search Results:', searchResults);

      // // Example: Call the AzureChatService
      // const messages = [ 
      //   { role: "system", content: "You are a helpful assistant. You will talk like a pirate." },
      //   { role: "user", content: "Can you help me?" }, 
      // ];
 
      // const chatResponses = await getChatCompletion(messages);
      // console.log('Chat Responses:', chatResponses);

      // await context.sendActivity(`Search results: ${JSON.stringify(searchResults)}`);
      // await context.sendActivity(`Chat responses: ${JSON.stringify(chatResponses)}`);
    });
  } catch (err) {
    //console.error('Error processing activity:', err);
  }
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

server.listen(port, () => { 
  console.log(`Server listening on port ${port}`);
});
