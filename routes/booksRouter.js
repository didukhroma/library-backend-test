import { Router } from 'express';

import booksControllers from '../controllers/booksControllers.js';

import validateBody from '../decorators/validateBody.js';
import { createBookSchema, updateBookSchema } from '../schemas/bookSchemas.js';

const createBookMiddleware = validateBody(createBookSchema);
const updateBookMiddleware = validateBody(updateBookSchema);

const booksRouter = Router();

booksRouter.get('/', booksControllers.getBooks);

booksRouter.post('/', createBookMiddleware, booksControllers.addBook);

booksRouter.put('/:isbn', updateBookMiddleware, booksControllers.updateBook);

booksRouter.delete('/:isbn', booksControllers.deleteBook);

export default booksRouter;
