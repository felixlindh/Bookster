/** GuestView Component
 * This component will render if you browse as a guest (not logged in)
 * We display all the books on this page through smaller components
 * When enterting this page we recieve all the Books from our "loader"
 * This component uses short polling to rerender the content on the page if it recieves a new data(version number)
 */
import { useLoaderData } from "react-router-dom";
import { fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";

export function loader() {
  return fetchBooks();
}

export default function GuestView() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  let loaderBooks = useLoaderData();
  
  useEffect(() => {
    setBooks(loaderBooks.books);
  }, [loaderBooks]);

  useEffect(() => {

    const interval = setInterval(async () => {
      const newBooks = await fetchBooks()
      const currentVersion = sessionStorage.getItem("BooksVersion")
      if(newBooks.version.toString() !== currentVersion.toString()) {
        for (let i = 0; i < newBooks.books.length; i++) {
          if(books[i]) {
            newBooks.books[i].order = books[i].order
          } else {
            newBooks.books[i].order = 0
          }
          
        }
        setBooks(newBooks.books)
        sessionStorage.setItem("BooksVersion", newBooks.version)
      }
      
    }, 10000);
    return () => clearInterval(interval);

  }, [books])

  useEffect(() => {
    
    const bookElements = books?.map((book, index) => {
      return (
        <tr key={index}>
          <td data-testid="book-title">{book.title}</td>
          <td>{book.author}</td>
          <td>{book.quantity === 0 ? "Out of stock" : book.quantity + " left"}</td>
        </tr>
      );
    });
    setBookElements(bookElements);
  }, [books]);

  async function handleChange(event) {
    const { value } = event.target;
    setSearch(value);
    
    if (value === "") {
       const data = await fetchBooks()
       setBooks(data.books)
    }
  }

  async function handleKeyDown(event) {
    if (event.code === "Enter") {
      let books = await searchBooks(search);
      
      setBooks(books);
    }
  }

  return (
    <>
      <input
        data-testid="search-input"
        className="userview-input"
        type="search"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <table className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>
    </>
  );
}