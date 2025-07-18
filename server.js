// tripwise/server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/places', async (req, res) => {
  const { lat, lon } = req.query;
  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);
  const serviceKey = process.env.FSQ_SERVICE_KEY; // Rename to SERVICE_KEY for clarity

  if (!serviceKey) {
    return res.status(500).json({ error: 'Missing Foursquare service key' });
  }

  try {
    console.log(serviceKey);
    const response = await fetch(
      `https://places-api.foursquare.com/places/search?ll=${parsedLat},${parsedLon}&limit=10`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${serviceKey}`, // Use Bearer token format
          'X-Places-Api-Version': '2025-06-17', // Add version header
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Foursquare' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Proxy server running at http://localhost:${PORT}`);
});
