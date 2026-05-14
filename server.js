const express = require('express');
const path = require('path');
const api = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', api);

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
