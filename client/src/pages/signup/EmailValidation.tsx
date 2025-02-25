import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { useState } from "react";

type EmailValidationProps = {
    onSubmit: () => void
}

export function EmailValidation({onSubmit}: EmailValidationProps) {
    const [email, setEmail] = useState('');

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    return (
        <div
            style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3rem",
            }}
        >
            <label
                htmlFor=""
                style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                }}
            >
                Get started with your email
            </label>

            <Input
                value={email}
                onChange={handleEmailChange}
                variant="borderless"
                classNames="email-register-input" />

            <Button
                onClick={onSubmit}
                size="xl"
                shape="pill"
                text="get started"
                color="primary"
                classNames="get-started-button"
            />
        </div>
    );
}
