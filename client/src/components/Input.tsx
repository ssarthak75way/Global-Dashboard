import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
    return (
        <div style={{ width: "100%" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" }}>{label}</label>
            <input
                ref={ref}
                className={`input-field ${className || ""}`}
                {...props}
            />
            {error && <span style={{ color: "red", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>{error}</span>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
