import { Form, Link, redirect, useActionData, useNavigate } from "react-router-dom"
import { loginUser } from "../service/authService"
import { parseJwt } from "../service/jwtService"

export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    const password = formData.get("password")

    console.log(username, password)

    try {
        const data = await loginUser({ username, password })
        sessionStorage.setItem("AuthToken", data.accessToken)
        const decoded = parseJwt(data.accessToken)
        console.log(decoded)
        if(decoded.role === "ADMIN") {
            return redirect("/admin")
        }
        return redirect("/user")
    } catch(err) {
        return err.message
    }
}

export default function Login() {
    const errorMessage = useActionData()
    const navigate = useNavigate()

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {errorMessage ? <p data-testid="err-msg" className="red">{errorMessage}</p> : <p className="hidden-error">Failed</p>}
            <Form data-testid="login-form" method="post" 
            className="login-form"
            replace >
                <input data-testid="username-field"  name="username" type="text" placeholder="Username" />
                <input data-testid="password-field" name="password" type="password" placeholder="Password" />
                <button className="login-btn" data-testid="login-btn">Log in</button>
            </Form>
            <button onClick={() => navigate("/guest")} className="guest-btn">Proceed as guest user</button>
            <p>No account? Sign up <span><Link to="/register">here</Link></span></p>

        </div>
    )
}