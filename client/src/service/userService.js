import { performRequest } from "./fetchService";


export async function getUsers() {
    const resp = await performRequest("http://127.0.0.1:4000/admin/users", "GET")
    const data = await resp.json()

    return data
}

export async function actionDeleteUser(username) {
    const resp = await performRequest("http://127.0.0.1:4000/admin/users", "DELETE", {username})
    const data = await resp.json()

    return data
}

export async function actionPromoteUser(username) {
    const resp = await performRequest("http://127.0.0.1:4000/admin/users", "PUT", {username})
    const data = await resp.json()

    return data
}