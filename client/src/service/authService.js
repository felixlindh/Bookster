import { performRequest } from "./fetchService";

export async function loginUser(credentials) {

    let resp = await performRequest("http://127.0.0.1:4000/auth/login", "POST", credentials)
    const data = await resp.json();
    console.log(data)

    if(!resp.ok) {
        //eslint-disable-next-line
        throw {
            message: "No user with thoose credentials found",
            status: data.status,
        }
    }

    return data;
}

export async function registerUser(credentials) {

    let resp = await performRequest("http://127.0.0.1:4000/auth/register", "POST", credentials)
    const data = await resp.json();
    console.log(data)

    return data;
}