import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DenteDeLeaoLogo from "@/components/login/DenteDeLeaoLogo";
import LoginInput from "@/components/login/LoginInput";
import styles from "./Login.module.css"
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
                <DenteDeLeaoLogo />

                <LoginInput imgSrc={ userIcon } placeholder="USUÁRIO" value={username} onChange={e => setUsername(e.target.value)} />
                <LoginInput imgSrc={ lockIcon } type="password" placeholder="SENHA" value={password} onChange={e => setPassword(e.target.value)} />

                {error && <p className={styles.failedLoginMsg}>{ error }</p>}

                <button className={styles.loginBtn} onClick={handleLogin}>ENTRAR</button>
                <Link className={styles.resetPassword} to="/esqueci-minha-senha">Esqueci minha senha</Link>
            </div>
        </div>
    )
}

export default Login