import { server_main_route } from "./configs"

async function checkSession() {
    try {
        const response = await fetch(`${server_main_route}/check-session`, {
            method: "GET",
            credentials: "include"
        });
    
        const data = await response.json();
        if (data.status === 0) return data.result;
        else console.log(data.error);
    } catch (error) {
        throw new Error(error);
    }
};

async function login(accountID, password) {
    try {
        const response = await fetch(`${server_main_route}/login`, {
            method: "POST",
            credentials: "include"
        })

        const data = await response.json();

    } catch (error) {
        throw new Error(error);
    }
}

export {checkSession};