import React, { useState, forwardRef } from 'react';

const customInputStyle: React.CSSProperties = {
    flex: "1",
    padding: "1.2rem 1.6rem",
    borderRadius: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--gray)",
    color: "var(--font-black)",
    fontFamily: "var(--font-inter)",
    lineHeight: "1.8rem",
    fontSize: "1.6rem",
    fontWeight: 500,
    outline: "none",
    transition: "border-color 0.2s ease",
}

const focusStyle: React.CSSProperties = {
    borderWidth: "2px",
    borderColor: "var(--deep-blue)",
}

interface CustomInputProps {
    id?: string;
    type?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: any) => void;
    focusColor: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ 
    id, 
    type = "text", 
    placeholder,
    value, 
    onChange,
    focusColor
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <input 
            ref={ref}
            id={id}
            style={{ 
                ...customInputStyle, 
                ...(isFocused ? { borderWidth: "2px", borderColor: focusColor } : {}) 
            }}
            type={type} 
            placeholder={placeholder}
            value={value}
            {...(type === "number" ? { min: 0 } : {})}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
    )
});

export default CustomInput