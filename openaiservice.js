const { AzureOpenAI } = require("openai");
const { getembeddingdata } = require("./textembeddingservice");
const { searchDocuments } = require("./searchService");
require('dotenv').config();
 
const endpoint =process.env.EndPoint;
const apiKey = process.env.ApiKey
 




function summarizeResults(results) {
  // Implement a summary logic, for example, take key points or common themes
  return results
    .slice(0, 3)
    .map((result) => `- ${result}...`)
    .join("\n");
}

async function getChatCompletion(query) {
  const searchResults = await searchDocuments(query);
  var summarizedResults = summarizeResults(searchResults);
  console.log(searchResults);
  const systemMessage = `
   You must answer using only the data provided in ${JSON.stringify(
     searchResults
   )}.
   Use headings, subheadings, definitions, descriptions, and avoid using your internal and external knowledge or other data sources.
   Every response must be in steps and should synthesize and summarize the information intelligently based on the provided documents.
   Avoid copying the content verbatim. If there are links present, provide them from our data source and include them in the corresponding subheadings.
   Provide citations to the retrieved documents for every claim in your answer.
   If the user’s question cannot be answered using the retrieved documents, respond with "I don't know."
   Do not use any external knowledge, and format your answer briefly in bulleted points with citation references.
   Use headings, bold titles, subtitles, and subheadings with links.
   Most importantly, do not provide any information from Wikipedia or any other external source websites.
 `;
  const client = new AzureOpenAI({
    apiKey: apiKey,
    endpoint: endpoint,
    apiVersion: "2024-05-01-preview",
    deployment: "gpt-35-turbo-16k",
  });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-35-turbo",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: `${query}`,
        },
      ],
      temperature: 0.4,
    

      max_tokens: 400,
      stream: true,
    });

    let ans = "";
    for await (const event of response) {
      for (const choice of event.choices) {
        if (choice.delta?.content) {
          let content = choice.delta.content;
          content = content.replace(/\[\d+\]/g, "");
          // Bold titles
           content = content.replace(/## (.+)/g, "**$1**");
          // Bold subtitles and format links, removing ".pdf" from URLs
          content = content.replace(
            /### (.+?)(https?:\/\/\S+?)(\.pdf)?/g,
            (match, p1, p2, p3) =>p3? "": `**${p1}[${p2}]**`
          );
          ans += content;
        }
      }
    }
    return ans;
  } catch (error) {
    console.error("Error getting chat completion:", error);
    throw error;
  }
}

module.exports = { getChatCompletion };
