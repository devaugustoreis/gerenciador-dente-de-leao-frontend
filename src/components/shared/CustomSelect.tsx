const customSelectStyle: React.CSSProperties = {
    flex: "1",
    padding: "1.2rem 1.6rem",
    borderRadius: "8px",
    border: "1px solid var(--gray)",
    color: "var(--font-black)",
    fontFamily: "var(--font-inter)",
    lineHeight: "1.8rem",
    fontSize: "1.6rem",
    fontWeight: 500,
    backgroundColor: "white",
    cursor: "pointer",
    appearance: "none",
    // Small Arrow down
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1.6rem center",
    backgroundSize: "1.6rem",
    paddingRight: "4rem"
}

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    id?: string;
    options: Option[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CustomSelect = ({ id, options, value = "", onChange}: CustomSelectProps) => {
    return (
        <select id={id} style={customSelectStyle} value={value} onChange={onChange}>
            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
    )
}

export default CustomSelect