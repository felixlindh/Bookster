import { fireEvent, render, screen } from "@testing-library/react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./Layout";
import AdminView, { loader as adminLoader } from "../pages/AdminView";
import { loginUser } from "../service/authService";
import { fetchBooks } from "../service/bookService";

test("Check if book is added to database", async () => {
  const resp = await loginUser({ username: "Bob", password: "123" });
  sessionStorage.setItem("AuthToken", resp.accessToken);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<AdminView />} loader={adminLoader} />
      </Route>
    )
  );

  render(<RouterProvider router={router} />);

  const addBookBtn = await screen.findByTestId("add-book-btn");
  fireEvent.click(addBookBtn);

  const bookTitle = await screen.findByTestId("add-book-title");
  const bookAuthor = await screen.findByTestId("add-book-author");
  const bookQuantity = await screen.findByTestId("add-book-quantity");
  const saveBookBtn = await screen.findByTestId("save-book-btn");

  fireEvent.change(bookTitle, { target: { value: "Den sista önskningen" } });
  fireEvent.change(bookAuthor, { target: { value: "Andrzej Sapkowski" } });
  fireEvent.change(bookQuantity, { target: { value: 20 } });

  fireEvent.click(saveBookBtn);

  const response = await fetchBooks();
  const lastBook = response.books.slice(-1);

  expect(lastBook[0].title).toBe("Den sista önskningen");
  expect(lastBook[0].author).toBe("Andrzej Sapkowski");
  expect(lastBook[0].quantity).toBe("20");
});