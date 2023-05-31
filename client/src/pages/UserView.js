/** AdminView Component
 * This component will render if you log in with an user account / if you have the USER Role
 * We display all the books on this page through smaller components
 * When enterting this page we recieve all the Books from our "loader"
 * This component uses short polling to rerender the content on the page if it recieves a new data(version number)
 */
import { redirect, useLoaderData} from "react-router-dom";
import { fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";
import BooksTable from "../components/BooksTable";
import MapBooks from "../components/MapBooks";

export async function loader() {
    const token = sessionStorage.getItem("AuthToken")
    const user = parseJwt(token)
    if(user === undefined) {
       return redirect("/login")
    } 
    const loaderBooks = await fetchBooks();
    loaderBooks.books.forEach(book => {
        book.order = 0
    });
  return loaderBooks
}

export default function UserView() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  
  let loaderBooks = useLoaderData();
  
  useEffect(() => {
    setBooks(loaderBooks.books);
    sessionStorage.setItem("BooksVersion", loaderBooks.version) 
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
    if(books !== null) {
      const mappedBooks = <MapBooks setBooks={setBooks}  books={books} />
      setBookElements(mappedBooks);
    }
    
    // eslint-disable-next-line
  }, [books]);

  async function handleChange(event) {
    const { value } = event.target;
    setSearch(value);
    
    if (value === "") {
       const data = await fetchBooks()
       data.books.forEach(book => {
        book.order = 0
      });
       setBooks(data.books)
    }
  }

  async function handleKeyDown(event) {
    if (event.code === "Enter") {
      let books = await searchBooks(search);
      books.forEach(book => {
        book.order = 0
      });
      setBooks(books);
    }
  }

  return (
    <>
      <input
        className="userview-input"
        type="search"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <BooksTable bookElements={bookElements} />

    </>
  );
}