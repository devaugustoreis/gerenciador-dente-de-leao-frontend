import CustomInput from "./CustomInput"

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    fontFamily: "var(--font-inter)",
    lineHeight: "2rem",
    fontSize: "1.6rem",
    fontWeight: 500,
}


interface InputLabelProps {
    label: string;
    labelAlignment?: React.CSSProperties["textAlign"];
    inputType?: string;
    inputPlaceholder?: string;
    inputValue?: string | number;
    color?: string;
    onChange?: (e: any) => void
}


const InputLabel = ({ label, labelAlignment = "left", inputType = "text", inputPlaceholder = "", inputValue, color = "blue", onChange}: InputLabelProps) => {
    const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
    let labelColor = { color: "var(--deep-blue)" }

    if (color === "blue") labelColor = { color: "var(--deep-blue)" }
    else if (color === "green") labelColor = { color: "var(--dark-moss-green)" }
    else if (color === "red") labelColor = { color: "var(--red-alert)" }

    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label style={{...labelStyle, ...labelColor, textAlign: labelAlignment}} htmlFor={inputId}>{ label }</label>
            <CustomInput id={inputId} type={inputType} placeholder={inputPlaceholder} value={inputValue} onChange={onChange} />
        </div>
    )
}

export default InputLabel