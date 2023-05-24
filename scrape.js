

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.mcc-mnc.com/';

axios.get(url)
  .then(response => {
    // Load the HTML content using Cheerio
    const $ = cheerio.load(response.data);

    // Find the table containing the data
    const table = $('table');

    // Initialize an empty array to store the data
    const data = [];

    // Extract the table rows
    const rows = table.find('tr');

    // Iterate over the rows and extract the data
    rows.each((index, row) => {
      const columns = $(row).find('td');
      if (columns.length >= 2) {
        const mcc = $(columns[0]).text().trim();
        const mnc = $(columns[1]).text().trim();
        const country = $(columns[2]).text().trim();
        const operator = $(columns[3]).text().trim();

        // Create an object for each entry
        const entry = {
          mcc: mcc,
          mnc: mnc,
          country: country,
          operator: operator
        };

        // Push the entry to the data array
        data.push(entry);
      }
    });

    // Save the data as JSON
    fs.writeFile('mcc_mnc_data.json', JSON.stringify(data), err => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('Data scraped and saved successfully.');
      }
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
