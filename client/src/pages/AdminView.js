import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { decreaseBookOrder, fetchBooks, increaseBookOrder, placeOrder, searchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";
import { actionDelete } from "../service/actionService";
import EditBook from "../components/EditBook";
import AddBook from "../components/AddBook";
import Users from "../components/Users";
import Books from "../components/Books";
import { getUsers } from "../service/userService";
import UserAction from "../components/UserAction";

export async function loader() {
    const token = sessionStorage.getItem("AuthToken")
    const decoded = parseJwt(token)
    if(!decoded) {
        return redirect("/login")
    }else if(decoded.role !== "ADMIN") {
       return redirect("/login")
    }else if (decoded.exp * 1000 < Date.now()) {
      return redirect("/login");
    }
    const loaderBooks = await fetchBooks();
    loaderBooks.books.forEach(book => {
        book.order = 0
    });
    const loaderUsers = await getUsers()
  return {loaderBooks, loaderUsers}
}



export default function AdminView() {
  const navigate = useNavigate()
  const [editBook, setEditBook] = useState(null)
  const [addBook, setAddBook] = useState(false)
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState(null);
  const [bookElements, setBookElements] = useState(null);
  const [toggleTable, setToggleTable] = useState(true)
  const [users, setUsers] = useState(null)
  const [userElements, setUserElements] = useState(null)
  const [toggleAction, setToggleAction] = useState(false)
  const [user, setUser ] = useState(null)
  const [action, setAction] = useState(undefined)
 
  
  let {loaderBooks, loaderUsers} = useLoaderData();
  

  useEffect(() => {
    setBooks(loaderBooks.books);
    setUsers(loaderUsers)
    sessionStorage.setItem("BooksVersion", loaderBooks.version) 
  }, [loaderBooks, loaderUsers]);

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

  async function increaseOrder(event) {
    const updateOrder = await increaseBookOrder(event, books)
    setBooks(updateOrder);
  }

  async function decreaseOrder(event) {
    const updateOrder = await decreaseBookOrder(event, books)
    setBooks(updateOrder);
  }

  async function orderBooks(event) {
    const { data, reRender, reRenderUsers } = await placeOrder(event, books);
    console.log(data);
    if (data.error === "Digital signing is invalid, request new token") {
      navigate("/login");
    } else {
      setBooks(reRender.books);
      setUsers(reRenderUsers);
    }
  }

  async function deleteBook(event) {
    const { value } = event.target
    const order = books[value]
    console.log(order)

    const data = await actionDelete(order.title)
    console.log(data)
    const reRender = await fetchBooks()
    reRender.books.forEach(book => {
        book.order = 0
      });
    setBooks(reRender.books)
    
  }

  function toggleEdit(event) {
    const { value } = event.target
    const book = books[value]
    setEditBook(book)

  }

  function handleUserAction(event) {
    const { value, name } = event.target
    
    const user = users[value]
    setAction(name)
    setUser(user)
    setToggleAction(true)
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
    if(users !== null) {
        const mappedUsers = users?.map((user, index) => {
        return (
          <tr key={index}>
            <td>{user.username}</td>
            <td>{user.role}</td>
            <td>{user.purchases ? user.purchases.length : 0}</td>
            <td>
              <button disabled={user.username === parseJwt(sessionStorage.getItem("AuthToken")).username} 
              name="promote" 
              value={index} 
              onClick={handleUserAction}>Promote</button>

              <button disabled={user.username === parseJwt(sessionStorage.getItem("AuthToken")).username} 
              name="delete" 
              value={index} 
              onClick={handleUserAction}>Delete</button>
            </td>
          </tr>
        )
      })
      setUserElements(mappedUsers)
    }
    
    // eslint-disable-next-line
  }, [books, editBook, users]);

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
      <div className="controller-container">
      <input
        className="search-input"
        type="search"
        placeholder="Search..."
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
      <button className="add-book-btn" onClick={() => setAddBook(true)}>Add new book</button>

      <div className="btn-container">
        <button onClick={() => setToggleTable(true)} className="book-btn">Books</button>
        <button onClick={() => setToggleTable(false)} className="user-btn">Users</button>
      </div>
      </div>
      {toggleAction && <UserAction user={user} setUsers={setUsers} toggle={setToggleAction} action={action} />}
      {toggleTable && <Books bookElements={bookElements} />}
      {!toggleTable && <Users userElements={userElements}/>}
        {addBook && <AddBook toggle={setAddBook} render={setBooks} />}
        {editBook && <EditBook book={editBook} toggle={setEditBook} render={setBooks} />}
    </>
  );
}