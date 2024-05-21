import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import salariesRouter from './routes/salaries';

// const salariesRouter = require('./routes/salaries');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.use('/salaries', salariesRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
