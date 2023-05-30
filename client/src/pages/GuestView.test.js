import {
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
  import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Layout from "../components/Layout";
import GuestView, {loader as guestLoader} from "./GuestView";

test("Check if you can search for books", async () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<GuestView />} loader={guestLoader} />
          </Route>
        )
      );
    render(<RouterProvider router={router}  />)

    const searchInput =  await screen.findByTestId("search-input")
    const bookToSearch = "Eragon"

    fireEvent.change(searchInput, { target: { value: bookToSearch } });
    fireEvent.keyDown(searchInput, { key: "Enter", code: "Enter", charCode: 13 });

    

    let bookTitle = await screen.findByTestId("book-title");
       
    
    
    expect(bookTitle).toHaveTextContent(bookToSearch)
})