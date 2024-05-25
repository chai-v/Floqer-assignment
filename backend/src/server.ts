import express, { Request, Response } from 'express';
import cors from 'cors';
import salariesRouter from './routes/salaries';
import genaiRouter from './routes/genai';
import genaiChat from './routes/chatGA'


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
app.use('/genai', genaiRouter);
app.use('/chatGA', genaiChat);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
