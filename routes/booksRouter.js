import { Router } from 'express';

import * as booksControllers from '../controllers/booksControllers.js';

// import validateBody from '../decorators/validateBody.js';

// import {
//   createContactSchema,
//   updateContactSchema,
// } from '../schemas/contactsSchemas.js';

// const createContactMiddleware = validateBody(createContactSchema);
// const updateContactMiddleware = validateBody(updateContactSchema);

const booksRouter = Router();

booksRouter.get('/', booksControllers.getBooks);

booksRouter.post('/', booksControllers.addBook);

booksRouter.put('/:isbn', booksControllers.updateBook);

booksRouter.delete('/:isbn', booksControllers.updateBook);

export default booksRouter;
