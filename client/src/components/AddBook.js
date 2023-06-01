/** We render this component whenever we press the button "Add New Book"
 * 
 */
import { useState } from "react"
import { actionAdd } from "../service/actionService";


export default function AddBook({toggle, render}) {
    const [inputValues, setInputValues] = useState({
        title: "",
        author: "",
        quantity: ""
    })
    function handleChange(event) {
        const { name, value } = event.target;
        setInputValues((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    async function saveChanges() {
        const data = await actionAdd(inputValues)
        if(data.message === 'book added successfully') {
            data.context.books.forEach(book => {
                book.order = 0
            });
            render(data.context.books)
            alert(`Succesfully added the book: ${inputValues.title}`)
            toggle(false)
        } else {
            alert("Something went wrong")
        }
    }
    return (
        <div className="edit-container">
        <h1 className="edit-title">Add book</h1>
        <label className="edit-label">Title</label>
        <input data-testid="add-book-title" className="edit-input" onChange={handleChange} name="title" value={inputValues.title} type="text" />
        <label className="edit-label">Author</label>
        <input data-testid="add-book-author" className="edit-input" onChange={handleChange} name="author" value={inputValues.author} type="text" />
        <label className="edit-label">Quantity</label>
        <input data-testid="add-book-quantity" className="edit-input" onChange={handleChange} name="quantity" value={inputValues.quantity} type="number" />
        <div>
        <button data-testid="save-book-btn" onClick={saveChanges} className="edit-save">Add new book</button>
        <button className="edit-discard" onClick={() => toggle(false)}>Discard changes</button>
        </div>
        </div>
    )
}