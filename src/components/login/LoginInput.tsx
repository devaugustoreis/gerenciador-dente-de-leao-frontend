import styles from "@/pages/Login.module.css"

interface LoginInputProps {
    imgSrc: string,
    placeholder: string,
    type?: string,
    value: string,
    onChange: (event: any) => void
}

const LoginInput = ({ imgSrc, type = "text", placeholder, value, onChange }: LoginInputProps) => {
    return (
        <div className={styles.inputContainer}>
            <img src={ imgSrc } alt="ícone de input" className={styles.icon} />
            <input type={type} placeholder={ placeholder } value={value} onChange={onChange} />
        </div>
    )
}

export default LoginInput;