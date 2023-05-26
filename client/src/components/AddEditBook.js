import { useState } from "react"
import { actionEdit } from "../service/actionService";
import { fetchBooks } from "../service/bookService";


export default function AddEditBook({book, toggle, render}) {
    const [inputValues, setInputValues] = useState({
        title: book.title,
        author: book.author,
        quantity: book.quantity
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
        const data = await actionEdit(book, inputValues)
        console.log(data)
        if(data.message === 'book updated successfully') {
            const reRender = await fetchBooks()
            reRender.forEach(book => {
                book.order = 0
            });
            render(reRender)
            alert(`Succesfully edited the book: ${inputValues.title}`)
            toggle(null)
        } else {
            alert("Something went wrong")
        }
    }
    return (
        <div className="edit-container">
        <h1 className="edit-title">Edit book</h1>
        <label className="edit-label">Title - {book.title}</label>
        <input className="edit-input" onChange={handleChange} name="title" value={inputValues.title} type="text" />
        <label className="edit-label">Author - {book.author}</label>
        <input className="edit-input" onChange={handleChange} name="author" value={inputValues.author} type="text" />
        <label className="edit-label">Quantity - {book.quantity}</label>
        <input className="edit-input" onChange={handleChange} name="quantity" value={inputValues.quantity} type="number" />
        <div>
        <button onClick={saveChanges} className="edit-save">Save changes</button>
        <button className="edit-discard" onClick={() => toggle(null)}>Discard changes</button>
        </div>
        </div>
    )
}