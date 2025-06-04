import styles from "./SectionHeader.module.css"
import plusIcon from "@/assets/icons/plus.svg"

interface SectionHeaderProps {
    title: string;
    buttonLabel?: string;
    onClick?: () => void;
} 

const SectionHeader = ({ title, buttonLabel, onClick }: SectionHeaderProps) => {
    return (
        <header className={styles.sectionHeader}>
            <h1 className={styles.sectionTitle}>{ title }</h1>
            { buttonLabel && <button className={styles.addButton} onClick={onClick}>
                <img src={plusIcon} alt="Ícone de Adição" />
                { buttonLabel }
            </button> }
        </header>
    )
}

export default SectionHeader