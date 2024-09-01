import path from 'path';
import fs from 'fs/promises';
import { filterArrByFilters } from '../helpers/filterArrByFilters.js';

const booksPath = path.resolve('db', 'books.json');

const listBooks = async query => {
  try {
    const bookList = JSON.parse(await fs.readFile(booksPath, 'utf8'));

    if (!bookList.length || !query) return bookList;

    const filteredList = filterArrByFilters(bookList, query);
    return filteredList;
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
  if (!booksList.length) return null;
  const bookIndex = booksList.findIndex(book => book.isbn === isbn);
  if (!~bookIndex) return null;
  return { booksList, bookIndex };
};

const addBook = async data => {
  const booksList = await listBooks();
  console.log(booksList);
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

const updateBook = async (isbn, data = {}) => {
  const checkISBN = await findBooksAndBookIndex(isbn);
  if (!checkISBN) return null;
  const { booksList, bookIndex } = checkISBN;

  if (!Object.keys(data).length) {
    data.isBorrowed = !booksList[bookIndex].isBorrowed;
  }

  booksList[bookIndex] = { ...booksList[bookIndex], ...data };
  await updateFile(booksList);
  return booksList[bookIndex];
};

export default {
  listBooks,
  addBook,
  deleteBook,
  updateBook,
};
