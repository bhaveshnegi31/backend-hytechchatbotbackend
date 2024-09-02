const { AzureOpenAI } = require("openai");

require('dotenv').config();
 

 
async function getembeddingdata(formattedContext) {
const client = new AzureOpenAI({
    apiKey: process.env.EmbeddingApiKey,
    endpoint: process.env.EmbeddingEndpoint,
    apiVersion: "2023-05-15",
    deployment: "text-embedding-ada-002",
});
try {
    const response = await client.embeddings.create({
        input: formattedContext,
        top:1 
    });
    
    return response.data[0].embedding;
} catch (error) {
    console.error("Error getting text embedding:", error);
    throw error; // Handle the error as needed
}
}

module.exports={
    getembeddingdata
}