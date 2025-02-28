import className from "@lib/classNames";
// import EyeIcon from '@assets/eye.svg';
// import EyeSlashedIcon from '@assets/eye-slashed.svg';
import "./Input.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free'
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { Button } from "@components/Button";


type InputProps = {
    value?: string,
    variant?: "outlined" | "borderless";
    type?: "text" | "password";
    disabled?: boolean;
    classNames?: string;
    styles?: React.CSSProperties;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onEnterKeyPress?: () => void
};

export function Input(props: InputProps) {
    const {
        type = "text",
        variant = "outlined",
        value = '',
        disabled = false,
        classNames,
        styles,
        ...rest
    } = props;

    function handlerKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' && props.onEnterKeyPress) {
            props.onEnterKeyPress();
        }
    }

    const classes = className(variant, classNames);

    return (
        <input
            disabled={disabled}
            onChange={(e) => props.onChange?.(e)}
            onKeyDown={handlerKeyPress}
            value={value}
            type={type}
            placeholder="type here"
            className={classes}
            style={styles}
            {...rest}
        />
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