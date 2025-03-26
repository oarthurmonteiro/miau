'use client'

import { UserDataContext } from "./UserData";
import { useContext, useState } from "react";
import { Button, Form, Input } from "@heroui/react";

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
        <Form action={handleSubmit}
            className="h-full flex flex-col items-center justify-center gap-20">

            <label
                htmlFor="email-register"
                className="text-4xl font-bold"
            >
                Nos conta qual seu melhor email
            </label>

            <Input isRequired
                name="email"
                type="email"
                variant="underlined"
                classNames={{
                    base: '',
                    inputWrapper: 'border-none shadow-none',
                    input: 'text-center font-bold text-5xl placeholder:text-tertiary',
                    errorMessage: 'text-center text-sm'
                }}
                placeholder="escreva aqui..."
                onValueChange={(newEmail) => setEmail(newEmail)}
                value={email}
            />


            <Button
                type="submit"
                radius="full"
                variant="bordered"
                color="primary"
                size="lg"
                className="get-started-button text-2xl py-6 px-8"
            >
                iniciar
            </Button>

        </Form>
    );
}
