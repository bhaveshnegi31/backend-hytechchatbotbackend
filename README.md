# HyTech Chatbot Backend

Backend service for the HyTech chatbot platform built using Node.js, Microsoft Bot Framework, Azure OpenAI, Azure AI Search, and Azure Functions.

## Features

- AI-powered chatbot integration using Azure OpenAI
- Microsoft Bot Framework support
- Website crawler for collecting and indexing website data
- Azure Blob Storage integration
- Azure AI Search integration
- Multilingual chat support with translation
- REST API endpoints for chatbot communication
- Azure Function based scheduled crawler execution

---

## Tech Stack

- Node.js
- Express / Restify
- Microsoft Bot Framework
- Azure OpenAI
- Azure AI Search
- Azure Blob Storage
- Azure Functions
- Cheerio
- Axios

---

## Project Structure

```bash
backend-hytechchatbotbackend-backend/
│
├── index.js                     # Main server entry point
├── botservice.js                # Bot message handling logic
├── crawler.js                   # Website crawler implementation
├── openaiservice.js             # Azure OpenAI integration
├── searchService.js             # Azure AI Search integration
├── textembeddingservice.js      # Embedding generation service
├── textranslation.js            # Translation and language detection
├── chat.html                    # Basic chatbot UI
│
├── functions/
│   ├── index.js
│   └── CrawlerFunction.js       # Timer-triggered Azure Function
│
├── package.json
└── .env
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/bhaveshnegi31/backend-hytechchatbotbackend.git
cd backend-hytechchatbotbackend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

Example:

```env
PORT=3000

MicrosoftAppId=
MicrosoftAppPassword=

AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_DEPLOYMENT_NAME=

AZURE_SEARCH_ENDPOINT=
AZURE_SEARCH_API_KEY=
AZURE_SEARCH_INDEX_NAME=

AZURE_STORAGE_CONNECTION_STRING=
CONTAINER_NAME=
```

---

## Running the Application

### Start the Backend Server

```bash
node index.js
```

### Run in Development Mode

```bash
npx nodemon index.js
```

---

## Bot Endpoint

The bot endpoint is exposed at:

```bash
POST /api/messages
```

This endpoint is used by Microsoft Bot Framework or Web Chat clients.

---

## Website Crawler

The project includes a crawler that:

- Crawls website pages
- Extracts text content
- Reads headings, paragraphs, and div content
- Avoids duplicate crawling
- Uploads generated content to Azure Blob Storage

Crawler implementation file:

```bash
crawler.js
```

---

## Azure Function Scheduler

The crawler can also run automatically using Azure Functions.

Function file:

```bash
functions/CrawlerFunction.js
```

Current schedule:

```bash
* 5 * * * *
```

---

## Multilingual Support

The chatbot supports:

- Language detection
- Automatic translation to English
- Translating responses back to the user's language

Implemented in:

```bash
textranslation.js
```

---

## API Flow

1. User sends a message
2. Language is detected
3. Message is translated to English (if required)
4. Azure OpenAI generates a response
5. Response is translated back to the user's language
6. Final response is returned to the user

---

## Dependencies

Main packages used:

- botbuilder
- restify
- express
- axios
- cheerio
- dotenv
- @azure/openai
- @azure/search-documents
- @azure/storage-blob

---

## Future Improvements

- User authentication
- Rate limiting
- Conversation history storage
- Better UI integration
- Improved crawler intelligence
- Analytics and monitoring



