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
    setBooks(loaderBooks);
  }, [loaderBooks]);

  useEffect(() => {
    
    const bookElements = books?.map((book, index) => {
      return (
        <tr key={index}>
          <td>{book.title}</td>
          <td>{book.author}</td>
          <td>{book.quantity === 0 ? "Out of stock" : book.quantity + " left"}</td>
        </tr>
      );
    });
    setBookElements(bookElements);
  }, [books]);

   function handleChange(event) {
    const { value } = event.target;
    setSearch(value);
    
    if (value === "") {
       setBooks(loaderBooks)
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
        className="search-input"
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