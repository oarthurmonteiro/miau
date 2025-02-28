import className from "@lib/classNames";
import "./Button.css";

type ButtonProps = {
    color?: "default" | "primary" | "secondary";
    variant?: "outlined" | "text" | "borderless";
    size?: "sm" | "md" | "lg" | "xl";
    shape?: 'default' | 'pill' | 'circle';
    icon?: React.ReactNode;
    htmlType?: 'submit' | 'button' | 'reset';
    text?: string;
    disabled?: boolean;
    children?: React.ReactNode;
    classNames?: string;
    styles?: React.CSSProperties;
    onClick?: () => void
};

export function Button(props: ButtonProps) {
    const {
        color = "default",
        variant = "outlined",
        size = "md",
        shape = 'default',
        htmlType = 'button',
        disabled = false,
        icon,
        text,
        children,
        classNames,
        styles,
        onClick,
    } = props;

    console.log(disabled)

    const classes = className(
        color,
        variant,
        size,
        shape,
        classNames
    );

    return (
        <button
            disabled={disabled}
            onClick={onClick}
            type={htmlType}
            className={classes}
            style={styles}
        >
            {icon}
            {children ?? text}
        </button>
    );
}
