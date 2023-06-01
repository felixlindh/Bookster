import { fetchBooks } from "./bookService";

export async function polling(books) {
  const newBooks = await fetchBooks();
  const currentVersion = sessionStorage.getItem("BooksVersion");
  
  if (String(newBooks.version) !== String(currentVersion)) {
    for (let i = 0; i < newBooks.books.length; i++) {
      if (books[i]) {
        newBooks.books[i].order = books[i].order;
      } else {
        newBooks.books[i].order = 0;
      }
    }

    sessionStorage.setItem("BooksVersion", newBooks.version);
    return newBooks.books;
  } else {
    return books;
  }
}