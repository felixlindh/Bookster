/** AdminView Component
 * This component will render if you log in with an admin account / if you have the Admin Role
 * We display all the books and users on this page through smaller components
 * When enterting this page we recieve all the Users and Books from our "loader"
 * This component uses short polling to rerender the content on the page if it recieves a new data(version number)
 */

import { redirect, useLoaderData } from "react-router-dom";
import { fetchBooks } from "../service/bookService";
import { useEffect, useState } from "react";
import { parseJwt } from "../service/jwtService";
import EditBook from "../components/EditBook";
import AddBook from "../components/AddBook";
import { getUsers } from "../service/userService";
import UserAction from "../components/UserAction";
import BooksTable from "../components/BooksTable";
import UsersTable from "../components/UsersTable";
import MapBooks from "../components/MapBooks";
import MapUsers from "../components/MapUsers";
import SubHeader from "../components/SubHeader";
import { polling } from "../service/pollingService";

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
  const [editBook, setEditBook] = useState(null)
  const [addBook, setAddBook] = useState(false)
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
      const newVersion = await polling(books);
      console.log(newVersion);
      setBooks(newVersion);
    }, 10000);
    return () => clearInterval(interval);
  }, [books]);

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
    if(books !== null) {
      const mappedBooks = <MapBooks setBooks={setBooks} setUsers={setUsers} books={books} editBook={editBook} toggleEdit={toggleEdit} />
      setBookElements(mappedBooks);
    }
    
    if(users !== null) {
        const mappedUsers = <MapUsers users={users} handleUserAction={handleUserAction} />
      setUserElements(mappedUsers)
    }
    
    // eslint-disable-next-line
  }, [books, editBook, users]);


  return (
    <>
      <SubHeader setToggleTable={setToggleTable} setAddBook={setAddBook} setBooks={setBooks} />
      
      {toggleAction && <UserAction user={user} setUsers={setUsers} toggle={setToggleAction} action={action} />}
      {toggleTable && <BooksTable bookElements={bookElements} />}
      {!toggleTable && <UsersTable userElements={userElements}/>}
        {addBook && <AddBook toggle={setAddBook} render={setBooks} />}
        {editBook && <EditBook book={editBook} toggle={setEditBook} render={setBooks} />}
    </>
  );
}