import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Login.module.css"
import userIcon from "@/assets/icons/user.png"
import lockIcon from "@/assets/icons/lock.png"
import DenteDeLeaoLogo from "@/components/login/DenteDeLeaoLogo";
import LoginInput from "@/components/login/LoginInput";

const ResetPassword = () => {
    // const [ resetToken, setResetToken ] = useState<string | null>(null)
    const [ newPassword, setNewPassword ] = useState("")
    const [ newPasswordConfirmation, setNewPasswordConfirmation ] = useState("")
    const [ error, setError ] = useState("")

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    
    useEffect(() => {
        // setResetToken(searchParams.get('token'))
    }, [searchParams, navigate])

    const handleResetPassword = async () => {
        setError("")

        try {
            // const data = await resetPassword(newPassword, newPasswordConfirmation)
            navigate("/login")
            
        } catch (error: any) {
            setError(error.message)
        }
    }
    
    return (
        <div className={styles.background}>
            <div className={styles.loginContainer}>
                <DenteDeLeaoLogo />

                <LoginInput imgSrc={ userIcon } placeholder="NOVA SENHA" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <LoginInput imgSrc={ lockIcon } type="password" placeholder="CONFIRME A NOVA SENHA" value={newPasswordConfirmation} onChange={e => setNewPasswordConfirmation(e.target.value)} />

                {error && <p className={styles.failedLoginMsg}>{ error }</p>}

                <button className={styles.loginBtn} onClick={handleResetPassword}>ALTERAR SENHA</button>
            </div>
        </div>
    )
}

export default ResetPassword