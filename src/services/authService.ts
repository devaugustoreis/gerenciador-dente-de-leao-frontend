const API_URL = "http://localhost:8080"

export const login = async (username: string, password: string) => {
    try {
        const response = await fetch(`${API_URL}/user/login`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ username, password }),
        })

        const data = await response.json()

        if (!response.ok) {
            if (data?.debugMessage === "Bad credentials") {
                throw new Error("Usuário ou senha inválidos.")
            }
            throw new Error(data?.message || "Falha no login.")
        }

        return data
    } catch (error: any) {
        throw new Error(error.message || "Falha no login.")
    }
}