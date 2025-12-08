import CustomSelect from "./CustomSelect"

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "8px",
    fontFamily: "var(--font-inter)",
    lineHeight: "2rem",
    fontSize: "1.6rem",
    fontWeight: 500,
}

interface Option {
    value: string;
    label: string;
}

interface SelectLabelProps {
    label: string;
    labelAlignment?: React.CSSProperties["textAlign"];
    options: Option[];
    placeholder?: string;
    value?: string;
    color?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectLabel = ({ 
    label, 
    labelAlignment = "left", 
    options,
    value,
    color = "blue",
    onChange
}: SelectLabelProps) => {
    const selectId = `select-${label.replace(/\s+/g, "-").toLowerCase()}`;
    let labelColor = { color: "var(--deep-blue)" }

    if (color === "blue") labelColor = { color: "var(--deep-blue)" }
    else if (color === "green") labelColor = { color: "var(--dark-moss-green)" }
    else if (color === "red") labelColor = { color: "var(--red-alert)" }

    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <label 
                style={{...labelStyle, ...labelColor, textAlign: labelAlignment}} 
                htmlFor={selectId}
            >
                {label}
            </label>
            <CustomSelect id={selectId} options={options} value={value} onChange={onChange}/>
        </div>
    )
}

export default SelectLabel