import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import booksServices from '../services/booksService.js';

const getBooks = async (req, res) => {
  const books = await booksServices.listBooks();

  res.json({
    books,
  });
};

const getBooksBySearch = async (req, res) => {
  const books = await booksServices.listBooks(req.query);

  res.json({
    books,
  });
};

const addBook = async ({ body }, res) => {
  const book = await booksServices.addBook(body);
  if (!book) {
    throw HttpError(404, 'Book with this ISBN already added');
  }

  res.status(201).json({
    book,
  });
};

const updateBook = async (req, res) => {
  const { isbn } = req.params;
  if (!Object.keys(req.body).length) {
    throw HttpError(400, 'No fields to update');
  }
  const updatedBook = await booksServices.updateBook(isbn, req.body);
  if (!updatedBook) {
    throw HttpError(404);
  }
  res.json({ updatedBook });
};

const updateBookStatus = async (req, res) => {
  const { isbn } = req.params;
  const updatedBook = await booksServices.updateBook(isbn);
  if (!updatedBook) {
    throw HttpError(404);
  }
  res.json({ updatedBook });
};

const deleteBook = async (req, res) => {
  const { isbn } = req.params;
  const book = await booksServices.deleteBook(isbn);
  if (!book) {
    throw HttpError(404);
  }

  res.json({ message: 'Book deleted successfully' });
};

export default {
  getBooks: ctrlWrapper(getBooks),
  addBook: ctrlWrapper(addBook),
  updateBook: ctrlWrapper(updateBook),
  deleteBook: ctrlWrapper(deleteBook),
  updateBookStatus: ctrlWrapper(updateBookStatus),
  getBooksBySearch: ctrlWrapper(getBooksBySearch),
};
