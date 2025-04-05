const API_URL = "http://localhost:8080"

export const login = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
        throw new Error("Usuário ou senha inválidos.")
    }

    return await response.json()
};