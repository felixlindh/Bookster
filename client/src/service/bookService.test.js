import { searchBooks } from "./bookService"



test("Check if you can search for a specific book", async () => {
    const searchBook = await searchBooks("Eragon")
    

    expect(searchBook[0].title).toBe('Eragon')
})