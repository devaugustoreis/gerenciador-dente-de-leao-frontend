import styles from './CustomButton.module.css'

interface CustomButtonProps {
  label: string
  actionColor: string
}

const CustomButton = ({ label, actionColor }: CustomButtonProps) => {
  const getActionClass = () => {
    switch (actionColor) {
      case "red": return styles.red
      case "outline-red": return styles.outlineRed
      case "green": return styles.green
      case "outline-green": return styles.outlineGreen
      case "blue": return styles.blue
      case "outline-blue": return styles.outlineBlue
      default: return ''
    }
  }

  return (
    <button className={`${styles.actionBtn} ${getActionClass()}`}>
      {label}
    </button>
  )
}

export default CustomButton
