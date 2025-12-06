const express = require('express');
const cors = require("cors");
const routes = require('./routes/userRoutes');
const connectDB = require('./config/mongo');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', routes);

app.get('/', (req, res) => {
  res.send('Hello, Myself Harish Khan !');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
