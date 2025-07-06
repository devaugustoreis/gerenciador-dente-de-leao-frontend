import { useNavigate, useLocation } from "react-router-dom"
import styles from "./MenuItem.module.css"

interface MenuItemProps {
  icon: string
  label: string
  navigateTo: string
}

const MenuItem = ({ icon, label, navigateTo }: MenuItemProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const iconPath = new URL(`../../assets/icons/${icon}.png`, import.meta.url).href

  const isActive = location.pathname === navigateTo

  const handleClick = () => {
    if (navigateTo === "/sair") {
      localStorage.removeItem("token")
    }
    navigate(navigateTo)
  }

  return (
    <li className={`${styles.menuItem} ${isActive ? styles.active : ""}`} onClick={handleClick} >
      <img src={iconPath} alt={`${label} ícone`} />
      <span>{label}</span>
    </li>
  )
}

export default MenuItem
