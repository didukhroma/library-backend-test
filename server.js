import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import booksRouter from './routes/booksRouter.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('api/books', booksRouter);

app.listen(Number(process.env.SERVER_PORT) || 3000, () => {
  console.log(
    `Server is running. Use our API on port: ${process.env.SERVER_PORT || 3000}`,
  );
});
