import request from 'supertest';
import app from '../server.js';

const requestWithSupertest = request(app);

describe('Book endpoints ', () => {
  afterAll(() => {
    app.close();
  });

  //ROUTE NOT fontLanguageOverride:
  test('ROUTE NOT FOUND', async () => {
    const { status, body } = await requestWithSupertest.get('/api');

    expect(status).toBe(404);
    expect(body).toEqual({ message: 'Route not found' });
  });

  //GET SUCCESS
  test('GET / get all books - success', async () => {
    const { status, type, body } = await requestWithSupertest.get('/api/books');

    expect(status).toBe(200);
    expect(type).toBe('application/json');
    expect(body).toHaveProperty('books');
    expect(body.books).toBeInstanceOf(Array);
  });

  //GET SUCCESS - TWO SEARCH QUERIES
  test('GET / get all books - with query - success', async () => {
    const query = { isbn: '978-1-56619-909-4' };

    const { status, type, body } = await requestWithSupertest.get(
      `/api/books?query=${query.isbn}`,
    );

    expect(status).toBe(200);
    expect(type).toBe('application/json');
    expect(body).toHaveProperty('books');
    expect(body.books).toBeInstanceOf(Array);
  });

  //GET SUCCESS - TWO SEARCH QUERIES  - NO RESULTS - WRONG ISBN
  test('GET / get all books - with query - wrong query  ', async () => {
    const query = { isbn: '978-1-56619-909-41' };

    const { status, type, body } = await requestWithSupertest.get(
      `/api/books?query=${query.isbn}`,
    );

    expect(status).toBe(200);
    expect(type).toBe('application/json');
    expect(body).toHaveProperty('books');
    expect(body.books).toBeInstanceOf(Array);
    expect(body.books.length).toBe(0);
  });

  //POST-SUCCESS
  test('POST / add new book - success', async () => {
    const newBook = {
      isbn: '121-1',
      title: 'Book 1',
      author: 'Author 1',
    };
    try {
      const res = await requestWithSupertest.post('/api/books').send(newBook);
      const { status, type, body } = res;

      expect(status).toBe(201);
      expect(type).toBe('application/json');
      expect(body.book).toHaveProperty('isbn');
      expect(body.book.isbn).toEqual(newBook.isbn);
      expect(body.book).toHaveProperty('title');
      expect(body.book.title).toEqual(newBook.title);
      expect(body.book).toHaveProperty('author');
      expect(body.book.author).toEqual(newBook.author);
      expect(body.book).toHaveProperty('isBorrowed');
      expect(body.book.isBorrowed).toBeFalsy();
    } finally {
      // Clean up the database
      await requestWithSupertest.delete(`/api/books/${newBook.isbn}`);
    }
  });

  //POST-BAD REQUEST-MISSING FIELD ISBN
  test('POST / add new book - bad request - missing field isbn', async () => {
    const newBook = {
      title: 'Book 1',
      author: 'Author 1',
    };
    const res = await requestWithSupertest.post('/api/books').send(newBook);
    const { status, type, text } = res;

    expect(status).toBe(400);
    expect(type).toBe('application/json');
    expect(text).toEqual('{"message":"\\"isbn\\" is required"}');
  });
  //POST-BAD REQUEST-MISSING FIELD TITLE
  test('POST / add new book - bad request - missing field title', async () => {
    const newBook = {
      isbn: '121-1',
      author: 'Author 1',
    };
    const res = await requestWithSupertest.post('/api/books').send(newBook);
    const { status, type, text } = res;

    expect(status).toBe(400);
    expect(type).toBe('application/json');
    expect(text).toEqual('{"message":"\\"title\\" is required"}');
  });
  //POST-BAD REQUEST-MISSING FIELD AUTHOR
  test('POST / add new book - bad request - missing field author', async () => {
    const newBook = {
      isbn: '121-1',
      title: 'Book 1',
    };
    const res = await requestWithSupertest.post('/api/books').send(newBook);
    const { status, type, text } = res;

    expect(status).toBe(400);
    expect(type).toBe('application/json');
    expect(text).toEqual('{"message":"\\"author\\" is required"}');
  });
  //POST-BAD REQUEST-ISBN NOT VALID
  test('POST / add new book - bad request - invalid isbn', async () => {
    const newBook = {
      isbn: '978',
      title: 'Book 1',
      author: 'Author 1',
    };
    const res = await requestWithSupertest.post('/api/books').send(newBook);
    const { status, type, text } = res;

    expect(status).toBe(400);
    expect(type).toBe('application/json');
    expect(text).toEqual('{"message":"ISBN must be in the format XXXX-XXXX"}');
  });

  //DELETE-SUCCESS
  test('DELETE / delete book - success', async () => {
    const newBook = {
      isbn: '121-1',
      title: 'Book 1',
      author: 'Author 1',
    };
    await requestWithSupertest.post('/api/books').send(newBook);
    const res = await requestWithSupertest.delete(`/api/books/${newBook.isbn}`);
    const { status, body } = res;
    expect(status).toBe(200);
    expect(body).toEqual({ message: 'Book deleted successfully' });
  });
  //DELETE-BOOK NOT FOUND
  test('DELETE / delete book - book not found', async () => {
    const res = await requestWithSupertest.delete(`/api/books/1111-1`);
    const { status, body } = res;
    expect(status).toBe(404);
    expect(body).toEqual({ message: 'Not Found' });
  });

  //PUT-SUCCESS
  test('PUT / update book - empty fields', async () => {
    const newBook = {
      isbn: '122-2',
      title: 'Book 1',
      author: 'Author 1',
    };
    try {
      await requestWithSupertest.post('/api/books').send(newBook);

      const updatedFields = {
        title: 'Book 2',
      };

      const updatedBook = { ...newBook, ...updatedFields };

      const res = await requestWithSupertest
        .put(`/api/books/${newBook.isbn}`)
        .send(updatedFields);

      const { status, body } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty('updatedBook');
      expect(body.updatedBook).toHaveProperty('isbn');
      expect(body.updatedBook.isbn).toEqual(updatedBook.isbn);
      expect(body.updatedBook).toHaveProperty('title');
      expect(body.updatedBook.title).toEqual(updatedBook.title);
      expect(body.updatedBook.isBorrowed).toEqual(
        updatedFields.isBorrowed || false,
      );
      expect(body.updatedBook).toHaveProperty('author');
      expect(body.updatedBook.author).toEqual(updatedBook.author);
    } finally {
      // Clean up the database
      await requestWithSupertest.delete(`/api/books/${newBook.isbn}`);
    }
  });

  //PUT-BAD REQUEST-EMPTY FIELDS
  test('PUT / update book - success', async () => {
    const newBook = {
      isbn: '122-1',
      title: 'Book 1',
      author: 'Author 1',
    };
    try {
      await requestWithSupertest.post('/api/books').send(newBook);

      const updatedFields = {};

      const res = await requestWithSupertest
        .put(`/api/books/${newBook.isbn}`)
        .send(updatedFields);

      const { status, body } = res;
      expect(status).toBe(400);
      expect(body).toEqual({ message: 'No fields to update' });
    } finally {
      // Clean up the database
      await requestWithSupertest.delete(`/api/books/${newBook.isbn}`);
    }
  });
  //PUT-BAD REQUEST-WRONG ISBN
  test('PUT / update book - wrong isbn', async () => {
    const updatedFields = {
      title: 'Book 1',
      author: 'Author 1',
    };

    const res = await requestWithSupertest
      .put(`/api/books/978-2-3`)
      .send(updatedFields);

    const { status, body } = res;
    expect(status).toBe(404);
    expect(body).toEqual({ message: 'Not Found' });
  });

  //PATCH-SUCCESS
  test('Patch / update book status - success', async () => {
    const newBook = {
      isbn: '123-1',
      title: 'Book 1',
      author: 'Author 1',
    };
    try {
      await requestWithSupertest.post('/api/books').send(newBook);

      const res = await requestWithSupertest.patch(
        `/api/books/${newBook.isbn}/borrow`,
      );

      const { status, body } = res;
      expect(status).toBe(200);
      expect(body).toHaveProperty('updatedBook');
      expect(body.updatedBook).toHaveProperty('isbn');
      expect(body.updatedBook).toHaveProperty('title');
      expect(body.updatedBook).toHaveProperty('author');
      expect(body.updatedBook).toHaveProperty('isBorrowed');
    } finally {
      await requestWithSupertest.delete(`/api/books/${newBook.isbn}`);
    }
  });
  //PATCH-BAD REQUEST-WRONG ISBN
  test('Patch / update book status - bad request - wrong isbn', async () => {
    const newBook = {
      isbn: '123-1',
      title: 'Book 1',
      author: 'Author 1',
    };
    try {
      await requestWithSupertest.post('/api/books').send(newBook);

      const res = await requestWithSupertest.patch(
        `/api/books/1111-1111/borrow`,
      );

      const { status, body } = res;
      expect(status).toBe(404);
      expect(body).toEqual({ message: 'Not Found' });
    } finally {
      await requestWithSupertest.delete(`/api/books/${newBook.isbn}`);
    }
  });
});
