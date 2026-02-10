import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    isLoading?: boolean;
}

const styles = {
    button: { display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }
};

const Button: FC<ButtonProps> = ({ variant = "primary", isLoading, children, className, ...props }) => {
    const getVariantClass = () => {
        switch (variant) {
            case "secondary": return "btn-secondary";
            case "danger": return "btn-danger";
            default: return "btn-primary";
        }
    };

    return (
        <button
            className={`btn ${getVariantClass()} ${className || ""}`}
            disabled={isLoading || props.disabled}
            {...props}
            style={{ ...styles.button, ...props.style }}
        >
            {isLoading ? "Loading..." : children}
        </button>
    );
};

export default Button;
