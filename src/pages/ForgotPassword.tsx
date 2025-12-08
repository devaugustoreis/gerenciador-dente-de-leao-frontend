import { useState } from "react";
import userIcon from "@/assets/icons/user.png"
import styles from "./Login.module.css"
import DenteDeLeaoLogo from "@/components/login/DenteDeLeaoLogo";
import LoginInput from "@/components/login/LoginInput";

const ForgotPassword = () => {
    const [ email, setEmail ] = useState<string>("")
    const [ error, setError ] = useState<string>("")
    const [ successfulRequest, setSuccessfulRequest ] = useState<boolean | null>(null)
    
    const handleRequestPasswordChange = async () => {
        try {
            // const data = await requestPasswordReset(email)
            // setSuccessfulRequest(true)
        } catch (error: any) {
            setError(error.message)
        }

        setError("Não foi possível enviar o e-mail. Por favor contate um administrador.")
        setSuccessfulRequest(false)
    }

    return (
        <div className={styles.background}>
            <div className={styles.forgotPasswordContainer}>
                <DenteDeLeaoLogo />

                { successfulRequest && <p className={styles.fogotPasswordLabel} style={{ marginTop: "1rem" }}>Pedido de redefinição de senha bem-sucedido!</p> }
                { successfulRequest == false && <p className={styles.failedLoginMsg}>{ error }</p> }
                { successfulRequest == null &&
                    <>
                        <p className={styles.fogotPasswordLabel}>Insira seu e-mail abaixo e lhe enviaremos um link para redefinir sua senha:</p>
                        <LoginInput imgSrc={ userIcon } placeholder="Insira seu e-mail" value={email} onChange={e => setEmail(e.target.value)} />
        
                        { error && <p className={styles.failedLoginMsg}>{ error }</p> }
        
                        <button className={styles.forgotPasswordBtn} onClick={handleRequestPasswordChange}>ENVIAR</button>
                    </>
                }
            </div>
        </div>
    )
}

export default ForgotPassword