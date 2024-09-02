const axios = require('axios');
require('dotenv').config();
const adminKey = process.env.AdminKey;
const apiVersion = process.env.ApiVersion;
const baseUrl = process.env.BaseURL;
const indexName = process.env.IndexName;
const searchDocuments = async (query) => {
  try {
    const response = await axios.post(
      `${baseUrl}/indexes/${indexName}/docs/search?api-version=${apiVersion}`,
      {
        search: query, // Text to search for
        top: 5, // Number of results to retrieve
        select: "chunk,title" // Fields to retrieve from the documents
      },
      {
        headers: {
          'api-key': adminKey,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Search response:', response.data);
    return response.data.value;
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
    throw new Error('Error searching documents');
  }
};


module.exports = {
  searchDocuments
};

