import { useNavigate } from "react-router-dom";
import denteDeLeaoLogo from "@/assets/images/dente-de-leao-logo.png";
import styles from "@/pages/Login.module.css"

const DenteDeLeaoLogo = () => {
    const navigate = useNavigate()

    return <img 
        src={ denteDeLeaoLogo } 
        alt="Logo da Clínica Dente de Leão"
        title="Ir para Login"
        className={styles.logo} 
        onClick={() => navigate("/login")} 
    />
}

export default DenteDeLeaoLogo