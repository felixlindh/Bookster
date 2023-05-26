import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login, { action as loginAction } from "./Login";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "../components/Layout";

test("Entering wrong credentials displays an error message", async () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Login />} action={loginAction} />
      </Route>
    )
  );
  render(<RouterProvider router={router} />);

  const username = "Bob";
  const password = "1234";

  const loginBtn = screen.getByTestId("login-btn");

  const usernameField = screen.getByTestId("username-field");
  const passwordField = screen.getByTestId("password-field");

  fireEvent.change(usernameField, { target: { value: username } });
  fireEvent.change(passwordField, { target: { value: password } });

  fireEvent.click(loginBtn);
  let errorMessage;
  await waitFor(() => {
     errorMessage = screen.getByTestId("err-msg");
     
    })

  expect(errorMessage).toBeInTheDocument();
});