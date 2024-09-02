const { app } = require('@azure/functions');
const { fetchData } = require('../functions/index'); // Ensure this path is correct

const baseUrl = 'https://watford.homeconnections.org.uk/watford-choice-based-lettings'; // Define baseUrl here

app.timer('CrawlerFunction', {
  schedule: '* 5 * * * *', // Every 30 seconds
  handler: async (myTimer, context) => {
    context.log('Timer function started.');

    try {
      // Call the fetchData function with the base URL
      await fetchData(baseUrl); // Pass the base URL directly
      context.log('Crawler function completed successfully.');
    } catch (error) {
      context.log(`Error in crawler function: ${error.message}`);
    }
  }
});
