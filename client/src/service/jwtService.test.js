import { loginUser } from "./authService";
import { parseJwt } from "./jwtService"


test("Check if parseJwt can us our username", async () => {
    const resp = await loginUser({username: "Bob", password: "123"})
    
    const decoded = parseJwt(resp.accessToken);

    expect(decoded.username).toBe("Bob")
    
})