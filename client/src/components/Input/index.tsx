import className from "@lib/classNames";
import "./Input.css";

type InputProps = {
    value?: string,
    variant?: "outlined" | "borderless";
    type?: "text" | "password";
    classNames?: string;
    styles?: React.CSSProperties;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
};

export function Input(props: InputProps) {
    const {
        type = "text",
        variant = "outlined",
        value = '',
        classNames,
        styles,
        ...rest
    } = props;

    const classes = className(variant, classNames);

    return (
        <input
            onChange={(e) => props.onChange?.(e)}
            value={value}
            type={type}
            placeholder="type here"
            className={classes}
            style={styles}
            {...rest}
        />
    );
}
