const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
    
    //mcc url to scrap data from.
  const url = 'https://www.mcc-mnc.com/';

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const table = $('table');
    const data = [];

    table.find('tr').each((index, row) => {
      const columns = $(row).find('td');
      if (columns.length >= 2) {
        const mcc = $(columns[0]).text().trim();
        const mnc = $(columns[1]).text().trim();
        const country = $(columns[2]).text().trim();
        const operator = $(columns[3]).text().trim();

        const entry = {
          mcc,
          mnc,
          country,
          operator
        };

        data.push(entry);
      }
    });

    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


