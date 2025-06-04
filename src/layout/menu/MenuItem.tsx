import { useNavigate } from "react-router-dom";
import styles from "./MenuItem.module.css";

interface MenuItemProps {
    icon: string;
    label: string;
    navigateTo: string;
};

const MenuItem = ({ icon, label, navigateTo }: MenuItemProps) => {
    const navigate = useNavigate()
    const iconPath = new URL(`../../assets/icons/${icon}.png`, import.meta.url).href;

    const handleClick = () => {
        navigate(navigateTo)
    }

    return (
        <li className={styles.menuItem} onClick={handleClick}>
            <img src={iconPath} alt={`${label} ícone`} />
            <span>{label}</span>
        </li>
    );
};

export default MenuItem;
