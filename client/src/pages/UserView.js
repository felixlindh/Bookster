import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { buyBooks, fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";

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
  const navigate = useNavigate()
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

  function increaseOrder(event) {
    const { value } = event.target;
    const updateOrder = books.map((book, i) => {
      if (parseInt(value) === parseInt(i)) {
        if(book.order < book.quantity) {
            book.order++;
        }
        return book;
      } else {
        return book;
      }
    });
    setBooks(updateOrder);
  }
  function decreaseOrder(event) {
    const { value } = event.target;
    const updateOrder = books.map((book, i) => {
      if (parseInt(value) === parseInt(i)) {
        if(book.order > 0) {
            book.order--;
        }
        return book;
      } else {
        return book;
      }
    });
    setBooks(updateOrder);
  }

  async function orderBooks(event) {
    const { value } = event.target
    const order = books[value]
    console.log(order)

    const data = await buyBooks(order.title, order.order)
    console.log(data)
    
    if(data.message) {
        alert("Purchase was successful")
    } else if (data.error === `Digital signing is invalid, request new token`) {
      navigate("/login")
    } else {
        alert("Something went wrong")
    } 
    
    const reRender = await fetchBooks()
          reRender.books.forEach(book => {
              book.order = 0
            });
        setBooks(reRender.books)
  }

  useEffect(() => {
    if(books !== null) {
      const mappedBooks = books?.map((book, index) => {
        return (
          <tr key={index}>
            <td>{book.title}</td>
            <td>{book.author}</td>
            <td>{book.quantity === 0 ? "Out of stock" : book.quantity + " left"}</td>
            <td className="order-td">
              <button data-testid="decrease" disabled={book.quantity === 0} value={index} onClick={decreaseOrder}>-</button>
              <div>{book.order}</div>
              <button data-testid="increase" disabled={book.quantity === 0} onClick={increaseOrder} value={index}>+</button>
              <button disabled={book.quantity === 0} value={index} onClick={orderBooks}>Order</button>
            </td>
          </tr>
        );
      });
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
      <table data-testid="book-table" className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
            <th className="table-header">Order</th>

          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>

    </>
  );
}