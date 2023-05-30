import { render, screen, } from "@testing-library/react"; 
import UserView, {loader as userLoader } from "./UserView";
import {
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    Route,
  } from "react-router-dom";
import Layout from "../components/Layout";
import { loginUser } from "../service/authService";
  

test("Check if book table i rendered",async () => {
  const resp = await loginUser({username: "Yves", password: "123"})
  sessionStorage.setItem("AuthToken", resp.accessToken)
    const router = createBrowserRouter(
        createRoutesFromElements(
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<UserView />} loader={userLoader} />
          </Route>
        )
      );
      render(<RouterProvider router={router} />);

      const table = await screen.findByTestId("book-table")

      expect(table).toBeInTheDocument()


})