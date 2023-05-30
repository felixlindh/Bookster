import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route,} from "react-router-dom"
import Layout from "./components/Layout";
import Login, {action as loginAction} from "./pages/Login";
import Register, {action as registerAction} from "./pages/Register";
import GuestView, {loader as guestLoader} from "./pages/GuestView";
import UserView, {loader as userLoader } from "./pages/UserView";
import AdminView, {loader as adminLoader} from "./pages/AdminView";
 


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />} >
    <Route path="login" element={<Login />} action={loginAction}  />
    <Route path="register" element={<Register />} action={registerAction} />
    <Route index element={<GuestView />} loader={guestLoader}/>
    <Route path="user" element={<UserView />} loader={userLoader}/>
    <Route path="admin" element={<AdminView />} loader={adminLoader} />
  </Route>
))
function App() {
  return (
      <RouterProvider router={router} />
    )
}

export default App;
