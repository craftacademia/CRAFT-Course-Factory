const express = require('express');
const path = require('path');
const scriptRoutes = require('./server/routes/scriptRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount Script Upload & Parsing Route
app.use('/api/script', scriptRoutes);

// Serve static frontend assets if built
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
