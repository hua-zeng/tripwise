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
  const { lat, lon, category } = req.query;
  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);
  const serviceKey = process.env.FSQ_SERVICE_KEY;

  if (!serviceKey) {
    return res.status(500).json({ error: 'Missing Foursquare service key' });
  }

  const categories = category; // default fallback to landmarks/museums

  try {
    const response = await fetch(
      `https://places-api.foursquare.com/places/search?ll=${parsedLat},${parsedLon}&radius=10000&limit=15&fsq_category_ids=${categories}&sort=rating&open_now=true`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${serviceKey}`,
          'X-Places-Api-Version': '2025-06-17',
        },
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Foursquare' });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Proxy server running at http://localhost:${PORT}`);
});
