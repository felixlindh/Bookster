import { performRequest } from "./fetchService"


export async function fetchBooks() {
    const resp = await fetch("http://127.0.0.1:4000/library/books")
    const data = await resp.json()
    console.log(data)
    let { books } = data
    return books
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