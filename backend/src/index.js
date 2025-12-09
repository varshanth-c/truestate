require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const salesRoutes = require('./routes/salesRoutes');
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';
const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow non-browser requests (curl, server-to-server)
    if (origin === FRONTEND_ORIGIN) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/sales', salesRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/truestate';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('Mongo connected');
    app.listen(PORT, ()=> console.log(`Server running ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connect err', err);
  });
