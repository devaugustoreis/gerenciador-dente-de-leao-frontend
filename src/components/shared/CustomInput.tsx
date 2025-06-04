const customInputStyle: React.CSSProperties = {
    flex: "1",
    padding: "1.2rem 1.6rem",
    borderRadius: "8px",
    border: "1px solid var(--gray)",
    color: "var(--font-black)",
    fontFamily: "var(--font-inter)",
    lineHeight: "1.8rem",
    fontSize: "1.6rem",
    fontWeight: 500,
}

interface CustomInputProps {
    type?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: any) => void
}

const CustomInput = ({ type = "text", placeholder = "value", value, onChange }: CustomInputProps) => {
    return (
        <input 
            style = { customInputStyle }
            type = { type } 
            placeholder = { placeholder }
            value = { value }
            {...(type === "number" ? { min: 0 } : {})}
            onChange = { onChange }
        />
    )
}

export default CustomInput