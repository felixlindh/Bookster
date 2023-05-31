/**Layout component 
 * In this component we use outlet to determine wich components are render on the screen.
 * Outlet looks at the router path to decide what to render 
 */
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";


export default function Layout() {

    return (
        <div>
            <Header />
                <main>
                    <Outlet />
                </main>
            <Footer />
        </div>
    )
}