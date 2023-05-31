import { actionDelete } from "./actionService"
import { performRequest } from "./fetchService"
import { getUsers } from "./userService"


export async function fetchBooks() {
    const resp = await fetch("http://127.0.0.1:4000/library/books")
    const data = await resp.json()
    
    return data
}

export async function searchBooks(query) {
    const resp = await fetch(`http://127.0.0.1:4000/library/books/search?q=${query}`)
    const data = await resp.json()
    return data
}

export async function buyBooks(title, quantity) {
    const resp = await performRequest("http://127.0.0.1:4000/library/user/books", "POST", {title, quantity})
    const data = await resp.json()

    return data 
}

export function increaseBookOrder(event, books) {
    const { value } = event.target;
    const updateOrder = books.map((book, i) => {
      if (parseInt(value) === parseInt(i)) {
        if (book.order < book.quantity) {
          book.order++;
        }
        return book;
      } else {
        return book;
      }
    });
    return updateOrder;
  }
  export function decreaseBookOrder(event, books) {
    const { value } = event.target;
    const updateOrder = books.map((book, i) => {
      if (parseInt(value) === parseInt(i)) {
        if (book.order > 0) {
          book.order--;
        }
        return book;
      } else {
        return book;
      }
    });
    return updateOrder;
  }

  export async function placeOrder(event, books) {
    const { value } = event.target;
    const order = books[value];
  
    const data = await buyBooks(order.title, order.order);
    console.log(data);
    if (data.message) {
      const reRender = await fetchBooks();
      reRender.books.forEach((book) => {
        book.order = 0;
      });
      console.log(reRender);
  
      const reRenderUsers = await getUsers();
  
      alert("Purchase was successful");
      return { data, reRender, reRenderUsers };
    } else if (data.error === "Digital signing is invalid, request new token") {
      alert("Session expired, please log in again");
      return data;
    } else {
      const reRender = await fetchBooks();
      reRender.books.forEach((book) => {
        book.order = 0;
      });
      console.log(reRender);
  
      const reRenderUsers = await getUsers();
  
      alert("Something went wrong, please try again");
      return { data, reRender, reRenderUsers };
    }
  }

  export async function deleteClickedBook(event, books) {
    const { value } = event.target;
    const order = books[value];
  
    await actionDelete(order.title);
  
    const reRender = await fetchBooks();
    reRender.books.forEach((book) => {
      book.order = 0;
    });
    console.log(reRender);
    return { reRender };
  }