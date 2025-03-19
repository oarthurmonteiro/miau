import className from "@lib/classNames";
// import EyeIcon from '@assets/eye.svg';
// import EyeSlashedIcon from '@assets/eye-slashed.svg';
import "./Input.css";
import { type ComponentProps, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free'
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Button } from "@components/Button";

type InputProps = {
    name: string,
    variant?: "outlined" | "borderless";
    type?: "email" | "text" | "password";
    disabled?: boolean;
    classNames?: string;
    error?: string
    label?: string,
    styles?: React.CSSProperties;
    onEnterKeyPress?: () => void
} & ComponentProps<"input">;

export function Input(props: InputProps) {
    const {
        type = "text",
        variant = "outlined",
        disabled = false,
        name,
        label,
        classNames,
        styles,
        error,
        ...rest
    } = props;

    function handlerKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && props.onEnterKeyPress) {
            props.onEnterKeyPress();
        }
    }

    let dangerClass = '';
    if (error) {
        dangerClass = 'danger';
    }

    const classes = className(variant, classNames, dangerClass);

    return (
        <div className="flex flex-col gap-0.5">

            {label && <label htmlFor={name} className="font-bold">{label}</label>}
            <input
                name={name}
                disabled={disabled}
                onKeyDown={handlerKeyPress}
                type={type}
                placeholder="escreva aqui..."
                className={classes}
                style={styles}
                {...rest}
            />

            {
                error && (
                    <small className="danger">
                        {error}
                    </small>
                )
            }
        </div>
    );
}


type PasswordProps = InputProps & {
    initialVisible?: boolean;
    canChangeVisibility?: boolean;
}

export function InputPassword(props: PasswordProps) {

    const {
        initialVisible,
        styles,
        canChangeVisibility = false,
        ...inputProps
    } = props;

    inputProps.variant = 'borderless';

    const [visible, setVisible] = useState(initialVisible ?? false);

    function handleToggleVisibility() {
        if (canChangeVisibility) {
            setVisible(!visible);
        }
    }

    const VisibilityIcon = visible ? faEyeSlash : faEye;

    return (
        <div style={styles} className={canChangeVisibility ? "password-with-visibility" : ""}>
            <Input {...inputProps} classNames={canChangeVisibility ? 'with-end-content' : ''} type={visible ? 'text' : 'password'} />
            {canChangeVisibility &&
                <Button styles={{
                    fontSize: 'inherit',
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    padding: '0',
                }}
                    variant="borderless"
                    icon={<FontAwesomeIcon icon={VisibilityIcon} />}
                    onClick={handleToggleVisibility} />}
        </div>
    )
}