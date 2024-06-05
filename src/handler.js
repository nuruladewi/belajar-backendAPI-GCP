const { nanoid } = require('nanoid');
const books = require('./books');

// Kriteria 3 API dapat menyimpan buku, body request:
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Nilai ID unik memanfaatkan nanoid
  const id = nanoid(16);
  // Variabel menggunakan boolean, hasil observasi pageCount === readPage
  let finished;
  if (readPage === pageCount) {
    finished = true;
  } else {
    finished = false;
  }
  // Variabel menggunakan tanggal
  const insertedAt = new Date().toISOString();
  // Variabel menggunakan nilai yg sama insertedAt
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  // Jika client tidak memasukkan nilai properti name
  if (!newBook.name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Jika client memasukkan nilai properti readPage > pageCount
  if (newBook.readPage > newBook.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Membuat data buku baru
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // Jika buku berhasil ditambah
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  // Jika buku gagal ditambah
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// Kriteria 4 Menampilkan seluruh buku
const getAllBooksHandler = (request, h) => {
  // Menggunakan fitur query parameters
  const { name, reading, finished } = request.query;

  // Membuat fungsi memfilter buku berdasar nama, reading, dan finished yang diinput
  let filteredBooks = books;
  if (name) {
    filteredBooks = filteredBooks.filter(
      (book) => book.name.toLowerCase().includes(name.toLowerCase()),
    );
  } else if (reading != null) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter(
      (book) => book.reading === isReading,
    );
  } else if (finished != null) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished,
    );
  }

  // Jika berhasil menampilkan seluruh buku
  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

// Kriteria 5 Menampilkan detail buku
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((n) => n.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  // Bila buku tidak menemukan ID
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 6 Mengubah data buku
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  // Membuat body request
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  // Memperbaharui nilai variabel Update
  const updatedAt = new Date().toISOString();
  // Mencari index dari nilai ID yang diinput client
  const index = books.findIndex((book) => book.id === id);

  // Jika indexnya berhasil ditemukan atau tidak kurang dari 1
  if (index !== -1) {
    // Jika client tidak menginput nilai variabel name
    if (!name) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    }
    // Jika client menginput nilai variabel readPage > pageCount
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    }
    // Menyimpan pembaharuan berdasar index ID
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    // Bila perubahan berhasil disimpan
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  // Bila ID yang dicari tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

// Kriteria 7 Menghapus buku
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;
  // Mencari index dari nilai ID yang diinput client
  const index = books.findIndex((book) => book.id === id);
  // Jika indexnya berhasil ditemukan atau tidak kurang dari 1
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  // Bila ID yang dicari tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
