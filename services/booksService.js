import path from 'path';
import fs from 'fs/promises';

const booksPath = path.resolve('db', 'books.json');

const listBooks = async () => {
  try {
    return JSON.parse(await fs.readFile(booksPath, 'utf8'));
  } catch (error) {
    error.message = 'Server error. Cannot read file';
    throw error;
  }
};

const updateFile = async data => {
  try {
    return await fs.writeFile(booksPath, JSON.stringify(data, null, 2));
  } catch (error) {
    error.message = 'Server error. Cannot write file';
    throw error;
  }
};

const findBooksAndBookIndex = async isbn => {
  const booksList = await listBooks();
  const bookIndex = booksList.findIndex(book => book.isbn === isbn);
  if (!~bookIndex) return null;
  return { booksList, bookIndex };
};

const addContact = async data => {
  const booksList = await listBooks();
  const bookIndex = booksList.findIndex(book => book.isbn === data.isbn);
  if (~bookIndex) return null;

  const newBook = { isBorrowed: false, ...data };
  await updateFile([...booksList, newBook]);
  return newBook;
};

const deleteBook = async isbn => {
  const checkISBN = await findBooksAndBookIndex(isbn);
  if (!checkISBN) return null;
  const { booksList, bookIndex } = checkISBN;

  const book = booksList.splice(bookIndex, 1);
  await updateFile(booksList);
  return book;
};

const updateBook = async (isbn, data) => {
  const checkISBN = await findBooksAndBookIndex(isbn);
  if (!checkISBN) return null;
  const { booksList, bookIndex } = checkISBN;

  booksList[bookIndex] = { ...booksList[bookIndex], ...data };
  await updateFile(booksList);
  return booksList[bookIndex];
};

export default {
  listBooks,
  addContact,
  deleteBook,
  updateBook,
};
