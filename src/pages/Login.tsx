import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "@/components/login/LoginInput";
import styles from "./Login.module.css"
import denteDeLeaoLogo from "@/assets/images/dente-de-leao-logo.png";
import userIcon from "@/assets/icons/user.png"
import lockIcon from "@/assets/icons/lock.png"
import { login } from "@/services/authService";

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleLogin = async () => {
        setError("")

        try {
            const data = await login(username, password)
            localStorage.setItem("token", data.token)

            navigate("/agenda")
            
        } catch (error: any) {
            setError(error.message)
        }
    }
    
    return (
        <div className={styles.background}>
            <div className={styles.loginContainer}>
                <img src={ denteDeLeaoLogo } alt="Logo da Clínica Dente de Leão" className={styles.logo} />

                <LoginInput imgSrc={ userIcon } placeholder="USUÁRIO" value={username} onChange={e => setUsername(e.target.value)} />
                <LoginInput imgSrc={ lockIcon } placeholder="SENHA" value={password} onChange={e => setPassword(e.target.value)} />

                {error && <p>{ error }</p>}

                <button className={styles.loginBtn} onClick={handleLogin}>ENTRAR</button>
                <a className={styles.resetPassword} href="#">Esqueci minha senha</a>
            </div>
        </div>
    )
}

export default Login