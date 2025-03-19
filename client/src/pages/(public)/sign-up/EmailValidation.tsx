import { Button } from "@components/Button";
import { Input } from "@components/Input";
import { UserDataContext } from "./UserData";
import { useContext, useState } from "react";

type EmailValidationProps = {
    onSubmit: () => void
}

export function EmailValidation({ onSubmit }: EmailValidationProps) {

    const { userData, handleUserDataUpdate } = useContext(UserDataContext);
    const [email, setEmail] = useState(userData?.email);

    function handleSubmit(payload: FormData) {
        const email = payload.get('email') as string;

        handleUserDataUpdate({ email })
        onSubmit();
    }

    return (
        <form action={handleSubmit}
            className="h-full flex flex-col items-center justify-center gap-12">

            <label
                htmlFor="email-register"
                className="text-4xl font-bold"
            >
                Me diga seu melhor email
            </label>

            <Input
                name="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                variant="borderless"
                classNames="email-register-input" />

            <Button
                htmlType="submit"
                size="xl"
                shape="pill"
                text="iniciar"
                color="primary"
                classNames="get-started-button"
            />
        </form>
    );
}
