require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const fetch   = require('node-fetch');
const path    = require('path');
const app     = express();

// 1) Enable CORS so same-origin or cross-origin both work
app.use(cors());

// 2) Serve all static files from ./public
app.use(express.static(path.join(__dirname, 'public')));

const tmdbKey = process.env.tmdbAPI;

app.get('/api/randomMovie', async (req, res) => {
  try {
    const page   = Math.floor(Math.random()*500)+1;
    const url    = new URL('https://api.themoviedb.org/3/discover/movie');
    url.searchParams.set('api_key', tmdbKey);
    url.searchParams.set('page', page);

    const json = await (await fetch(url)).json();
    const arr  = Array.isArray(json.results)? json.results : [];
    const pick = arr[Math.floor(Math.random()*arr.length)] || {};

    res.json({
      title: pick.title  || 'Unknown',
      year:  pick.release_date
               ? pick.release_date.slice(0,4)
               : 'n/a'
    });
  } catch(e) {
    console.error(e);
    res.status(500).json({ error: 'fetch failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Listening on http://localhost:${PORT}`));
