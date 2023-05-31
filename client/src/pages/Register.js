/** Register Component
 * This component uses a custom action when the form is submitted.
 * This component is used to create a new account
 * If the user enters the wrong credentials an errorMessage is displayed for good UX
 */
import { Form, Link, redirect, useActionData } from "react-router-dom"
import { registerUser } from "../service/authService"


export async function action({ request }) {
    const formData = await request.formData()
    const username = formData.get("username")
    const password = formData.get("password")

    if(username === "" || password === "") {
        return "Please enter both username and password"
    }

    const data = await registerUser({username, password})
    if(data.message) {
        alert(data.message)
        return redirect("/login")
    } else if(data.error) {
        return data.error
    }
    return null
}
export default function Register() {
    const errorMessage = useActionData()
    return (
        <div className="login-container">
            <h2 className="login-title">Register account</h2>
            {errorMessage && <p className="red">{errorMessage}</p>}
            <Form data-testid="login-form" method="post" 
            className="login-form"
            replace >
                <input data-testid="username-field"  name="username" type="text" placeholder="Username" />
                <input data-testid="password-field" name="password" type="password" placeholder="Password" />
                <button className="login-btn" data-testid="login-btn">Register account</button>
            </Form>
    
            <p>Allready have an account? Sign in <span><Link to="/login">here</Link></span></p>

        </div>
    )
}