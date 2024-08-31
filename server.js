import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';

import errorHandler from './middlewares/errorHandler.js';
import routeNotFound from './middlewares/routeNotFound.js';
import booksRouter from './routes/booksRouter.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/books', booksRouter);

app.use(routeNotFound);
app.use(errorHandler);

let server = null;

server = app.listen(Number(process.env.SERVER_PORT) || 3000, () => {
  console.log(
    `Server is running. Use our API on port: ${process.env.SERVER_PORT || 3000}`,
  );
});

export default server;
