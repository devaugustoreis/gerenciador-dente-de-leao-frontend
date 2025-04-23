import denteDeLeaoLogo from "../../assets/images/dente-de-leao-logo.png";
import styles from "./Menu.module.css"
import MenuItem from "./MenuItem";

const menuItems = [
    { icon: "calendar", label: "Agenda", navigateTo: "/agenda" },
    { icon: "edit", label: "Finalizar Consultas", navigateTo: "/finalizar-consulta" },
    { icon: "tooth", label: "Materiais", navigateTo: "/materiais" },
    { icon: "sets", label: "Conjuntos", navigateTo: "/conjuntos" },
    { icon: "logout", label: "Sair", navigateTo: "/sair" },
]

const Menu = () => {
    return (
        <menu className={styles.menu}>
            <img src={ denteDeLeaoLogo } alt="Logo da Clínica Dente de Leão" className={styles.logo} />
            <ul className={styles.menuItemList}>
                { menuItems.map(item => (
                    <MenuItem key={item.label} icon={item.icon} label={item.label} navigateTo={item.navigateTo} />
                ))}
            </ul>
        </menu>
    )
}

export default Menu