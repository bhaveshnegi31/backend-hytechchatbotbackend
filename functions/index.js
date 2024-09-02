require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const urlModule = require('url');
const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING =process.env.AZURE_STORAGE_CONNECTION_STRING;;
const containerName = process.env.CONTAINER_NAME;
const baseUrl = 'https://watford.homeconnections.org.uk/watford-choice-based-lettings'; // Define base URL
const visitedUrls = new Set();

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function fetchData(url) {
  try {
    // Normalize the URL by removing fragments
    const normalizedUrl = url.split('#')[0];

    if (visitedUrls.has(normalizedUrl)) {
      console.log(`Skipping already visited URL: ${normalizedUrl}`);
      return;
    }

    const { data } = await axios.get(normalizedUrl);
    const $ = cheerio.load(data);

    const links = [];
    $('a').each((index, element) => {
      let link = $(element).attr('href');
      if (link) {
        link = urlModule.resolve(baseUrl, link);
        if (link.startsWith(baseUrl) && !visitedUrls.has(link.split('#')[0])) {
          links.push(link.split('#')[0]); // Normalize the link before adding to the queue
        }
      }
    });

    const paragraphs = new Set();
    $('p').each((index, element) => {
      const text = $(element).text().trim();
      if (text) paragraphs.add(text);
    });

    const headers = new Set();
    $('h1, h2, h3').each((index, element) => {
      const text = $(element).text().trim();
      if (text) headers.add(text);
    });

    const divTexts = new Set();
    $('div').each((index, element) => {
      const text = $(element).text().trim();
      if (text) divTexts.add(text);
    });

    const spanTexts = new Set();
    $('span').each((index, element) => {
      const text = $(element).text().trim();
      if (text) spanTexts.add(text);
    });

    const extractedData = {
      url: normalizedUrl,
      paragraphs: Array.from(paragraphs),
      headers: Array.from(headers),
      divTexts: Array.from(divTexts),
      spanTexts: Array.from(spanTexts),
      crawleddata: Array.from((data.products) ? (data.products) : ""),
    };

    await createPDF(extractedData);

    visitedUrls.add(normalizedUrl);

    for (const link of links) {
      if (!visitedUrls.has(link)) {
        await fetchData(link);
      }
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}: ${error.message}`);
  }
}

async function createPDF(data) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const outputPath = `${sanitizeTitle(data.url)}.pdf`;

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);

      try {
        const blobClient = containerClient.getBlockBlobClient(outputPath);
        await blobClient.uploadData(pdfBuffer);

        console.log(`PDF uploaded successfully to Azure Blob Storage as ${outputPath}`);
        resolve();
      } catch (error) {
        console.error(`Error uploading PDF: ${error.message}`);
        reject(error);
      }
    });

    doc.fontSize(20).text('Extracted Data', { align: 'center' });
    doc.moveDown();

    doc.fontSize(16).text('URL:', { underline: true });
    doc.fontSize(12).text(data.url);
    doc.moveDown();

    if (data.headers.length) {
      doc.fontSize(16).text('Headers:', { underline: true });
      data.headers.forEach(header => {
        doc.fontSize(12).text(header);
      });
      doc.moveDown();
    }

    if (data.paragraphs.length) {
      doc.fontSize(16).text('Paragraphs:', { underline: true });
      data.paragraphs.forEach(paragraph => {
        doc.fontSize(12).text(paragraph);
      });
      doc.moveDown();
    }

    if (data.divTexts.length) {
      doc.fontSize(16).text('Div Texts:', { underline: true });
      data.divTexts.forEach(text => {
        doc.fontSize(12).text(text);
      });
      doc.moveDown();
    }

    if (data.spanTexts.length) {
      doc.fontSize(16).text('Span Texts:', { underline: true });
      data.spanTexts.forEach(text => {
        doc.fontSize(12).text(text);
      });
      doc.moveDown();
    }

    doc.end();
  });
}

function sanitizeTitle(title) {
  return title.replace(/[\\/:*?"<>|]/g, '_');
}

fetchData(baseUrl).then(() => {
  console.log('Crawling and PDF generation completed.');
});

module.exports = {
  fetchData,
  createPDF,
  sanitizeTitle
};
