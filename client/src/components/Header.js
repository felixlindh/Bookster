import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { parseJwt } from "../service/jwtService"

export default function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser ] = useState()


    useEffect(() => {
        const authToken = sessionStorage.getItem("AuthToken")
        if(authToken) {
            const username = parseJwt(authToken)
            setUser(username.username)
        }
        
    }, [location])

    

    function logout() {
        if(user) {
            sessionStorage.removeItem("AuthToken")
            setUser(null)
        }
        
        navigate("/login")
    }

    return (
        <header>
            <h1>Bookster Website</h1>
              <div className="user-info">
                <p>Browsing as {user ? user : "Guest"}</p>
                <button onClick={logout} className="log-out-btn">{user ? "Logout" : "Login"}</button>
            </div> 
        </header>
    )
}