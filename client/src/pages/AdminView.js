import { redirect, useLoaderData } from "react-router-dom";
import { buyBooks, fetchBooks, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";
import { actionDelete } from "../service/actionService";
import AddEditBook from "../components/AddEditBook";

export async function loader() {
    const token = sessionStorage.getItem("AuthToken")
    const user = parseJwt(token)
    if(!user) {
        return redirect("/login")
    }else if(user.role !== "ADMIN") {
       return redirect("/login")
    } 
    const loaderBooks = await fetchBooks();
    loaderBooks.forEach(book => {
        book.order = 0
    });
  return loaderBooks
}

export default function AdminView() {
  const [editBook, setEditBook] = useState(null)
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  
  let loaderBooks = useLoaderData();
  
  useEffect(() => {
    setBooks(loaderBooks);
  }, [loaderBooks]);

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
    const reRender = await fetchBooks()
    reRender.forEach(book => {
        book.order = 0
      });
    setBooks(reRender)
    if(data.message) {
        alert("Purchase was successful")
    }else {
        alert("Something went wrong")
    } 
    
  }

  async function deleteBook(event) {
    const { value } = event.target
    const order = books[value]
    console.log(order)

    const data = await actionDelete(order.title)
    console.log(data)
    const reRender = await fetchBooks()
    reRender.forEach(book => {
        book.order = 0
      });
    setBooks(reRender)
    
  }

  function toggleEdit(event) {
    const { value } = event.target
    const book = books[value]
    setEditBook(book)

  }

  useEffect(() => {
    
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
          <td>
            <button disabled={editBook} value={index} onClick={toggleEdit}>Edit</button>
            <button value={index} onClick={deleteBook}>Delete</button>
          </td>
        </tr>
      );
    });
    setBookElements(mappedBooks);
    // eslint-disable-next-line
  }, [books, editBook]);

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
      books.forEach(book => {
        book.order = 0
      });
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
      <table data-testid="book-table" className="book-table">
        <thead>
          <tr>
            <th className="table-header">Book title</th>
            <th className="table-header">Book author</th>
            <th className="table-header">Availability</th>
            <th className="table-header">Order</th>
            <th className="table-header">Action</th>

          </tr>
        </thead>
        <tbody>{bookElements}</tbody>
      </table>
        {editBook && <AddEditBook book={editBook} toggle={setEditBook} render={setBooks} />}
    </>
  );
}