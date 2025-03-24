import { useContext, useState } from "react";
import { UserDataContext } from "./UserData";
import { Input } from "@heroui/react";
import { z } from "zod";
import { Password as PasswordSchema } from "@lib/types";

export function FullName() {

    const { userData } = useContext(UserDataContext);
    const [fullName, setFullName] = useState(userData?.fullName);

    return (
        <>
            <label
                htmlFor="fullName"
                className="text-4xl font-bold"
            >
                Seu Nome Completo
            </label>

            <Input isRequired
                autoFocus
                name="fullName"
                variant="underlined"
                classNames={{
                    base: '',
                    inputWrapper: 'border-none shadow-none',
                    input: 'font-bold text-5xl placeholder:text-tertiary',
                    errorMessage: 'text-sm'
                }}
                placeholder="escreva aqui..."
                onValueChange={(newFullName) => setFullName(newFullName)}
                value={fullName}
                validate={(fullName: string) => {
                    const validSchema = z.string().regex(/^[A-Za-z'-]{2,16} [\S ]{2,64}$/);
                    if (false === validSchema.safeParse(fullName).success) {
                        return "Esperamos ao menos dois nomes com mais de 2 caracteres cada...";
                    }

                    return true;
                }}
            />
        </>
    )
}

export function Password() {

    const { userData } = useContext(UserDataContext);
    const [password, setPassword] = useState(userData?.password);


    return (
        <>
            <label
                htmlFor="password"
                className="text-4xl font-bold"
            >
                Sua Super Senha
            </label>

            <Input isRequired
                autoFocus
                name="password"
                type="password"
                variant="underlined"
                classNames={{
                    base: '',
                    inputWrapper: 'border-none shadow-none',
                    input: 'font-bold text-5xl placeholder:text-tertiary placeholder:text-3xl',
                    errorMessage: 'text-sm',
                    description: 'text-sm font-bold',
                }}
                placeholder="guardamos longe dos zoiudo ;)"
                description="mas precisams de pelo menos 12 caracteres"
                onValueChange={(newPassword) => setPassword(newPassword)}
                value={password}
                validate={(password: string) => {
                    const safedPassword = PasswordSchema.safeParse(password)
                    if (false === safedPassword.success) {
                        return "O mínimo são 12 caracteres";
                    }

                    return true;
                }}
            />
        </>
    )
}

export function ConfirmPassword() {

    const { userData } = useContext(UserDataContext);

    return (
        <>
            <label
                htmlFor="passwordConfirm"
                className="text-4xl font-bold"
            >
                Sua Super Senha (De Novo)
            </label>

            <Input isRequired
                autoFocus
                name="password"
                type="password"
                variant="underlined"
                classNames={{
                    base: '',
                    inputWrapper: 'border-none shadow-none',
                    input: 'font-bold text-5xl placeholder:text-tertiary placeholder:text-3xl',
                    errorMessage: 'text-sm',
                    description: 'text-sm font-bold',
                }}
                placeholder="basta escrever a mesma senha"
                description="precisamos garantir que ocê escreveu direitin"
                validate={(password: string) => {
                    if (userData?.password !== password) {
                        return "As senhas estão diferentes...";
                    }

                    return true;
                }}
            />
        </>
    )


}