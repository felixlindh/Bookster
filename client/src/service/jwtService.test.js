import { parseJwt } from "./jwtService"


test("Check if parseJwt can us our username", () => {
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

    const decoded = parseJwt(authToken);

    expect(decoded.name).toBe("John Doe")
    
})