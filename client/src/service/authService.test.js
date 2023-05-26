import { loginUser } from "./authService"


test("Check if login function is working", async () => {

    const login = await loginUser({username: "Bob", password: "123"})
    console.log(login)

    expect(login.message).toBe('Successfully signed in')
})