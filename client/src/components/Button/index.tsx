import className from "@lib/classNames";
import "./Button.css";

type ButtonProps = {
    color?: "default" | "primary" | "secondary";
    variant?: "outlined" | "text";
    size?: "sm" | "md" | "lg" | "xl";
    shape?: 'default' | 'pill'
    htmlType?: 'submit' | 'button' | 'reset';
    text?: string;
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
        text,
        children,
        classNames,
        styles,
        onClick,
    } = props;

    const classes = className(color, variant, size, shape, classNames);

    return (
        <button onClick={onClick} type={htmlType} className={classes} style={styles}>
            {children ?? text}
        </button>
    );
}
