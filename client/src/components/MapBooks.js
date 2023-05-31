/**MapBooks Component
 * Maps through recived books as props and returns jsx to display them inside the table
 */
import { useNavigate } from "react-router-dom";
import { decreaseBookOrder, deleteClickedBook, increaseBookOrder, placeOrder } from "../service/bookService";
import { parseJwt } from "../service/jwtService";


export default function MapBooks({books, editBook, toggleEdit, setBooks, setUsers}) {
    const navigate = useNavigate()
    function increaseOrder(event) {
    const updateOrder = increaseBookOrder(event, books)
    setBooks(updateOrder);
    }

    function decreaseOrder(event) {
    const updateOrder = decreaseBookOrder(event, books)
    setBooks(updateOrder);
    }

    async function deleteBook(event) {
        const { reRender } = await deleteClickedBook(event, books);
        setBooks(reRender.books);
    }
    async function orderBooks(event) {
        const { data, reRender, reRenderUsers } = await placeOrder(event, books);
        console.log(data);
        if (data.error === "Digital signing is invalid, request new token") {
          navigate("/login");
        } else {
          setBooks(reRender.books);
          if(decoded.role === "ADMIN") {
            setUsers(reRenderUsers);
          }
          
        }
      }
    const decoded = parseJwt(sessionStorage.getItem("AuthToken"))


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
            {decoded.role === "ADMIN" && <td>
              <button disabled={editBook} value={index} onClick={toggleEdit}>Edit</button>
              <button value={index} onClick={deleteBook}>Delete</button>
            </td>}
          </tr>
        );
      });

    return mappedBooks
}