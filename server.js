require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const residentRoutes = require('./src/routes/residentRoutes');
const visitRoutes = require('./src/routes/visitRoutes');
const donationRoutes = require('./src/routes/donationRoutes');
const galleryRoutes = require('./src/routes/galleryRoutes');
const path = require('path');
const { attachUser } = require('./src/middlewares/auth');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(attachUser);

// Routes (Step 4)
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/gallery', galleryRoutes);

// Basic routes for Step 1
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/healthz', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server after DB connection
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB error:', err.message);
    process.exit(1);
  }
})();
