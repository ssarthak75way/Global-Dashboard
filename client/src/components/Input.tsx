import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const styles = {
    container: { width: "100%" },
    label: { display: "block", marginBottom: "0.5rem", fontSize: "0.875rem" },
    error: { color: "red", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
    return (
        <div style={styles.container}>
            <label style={styles.label}>{label}</label>
            <input
                ref={ref}
                className={`input-field ${className || ""}`}
                {...props}
            />
            {error && <span style={styles.error}>{error}</span>}
        </div>
    );
});

Input.displayName = "Input";

export default Input;
