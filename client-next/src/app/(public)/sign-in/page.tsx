'use client'

import type { FormEvent } from "react";

import { Form, Input, Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Providers/Auth";

export default function Page() {

    const router = useRouter();
    const { signInMutation } = useAuth();
    const { isPending, mutate } = signInMutation;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = new FormData(event.currentTarget);

        mutate(payload);
    }

    if (isPending) return <Spinner size="lg" variant="wave" className="flex justify-center" />

    return (
        // <main className="grow content-center">
        <div className="flex justify-around">
            <div className="flex flex-col gap-5 justify-center">
                <div>
                    <p className='font-bold text-3xl'>Bem-vindx de volta!</p>
                    <p>Bora dar um bisu no din-din?</p>
                </div>

                <Form onSubmit={handleSubmit} className="flex flex-col gap-4" >
                    <Input
                        isRequired
                        label="E-mail"
                        labelPlacement="outside"
                        name="email"
                        placeholder="ex: email@gmail.com"
                        value={"arthur@email.com"}
                        type="email"
                    />

                    <Input
                        isRequired
                        label="Senha"
                        labelPlacement="outside"
                        name="password"
                        type="password"
                        value={"senhamuitogrande"}
                        placeholder="ex: minha-senha-super-segura"
                    />

                    <Button
                        type="submit"
                        color="primary"
                        variant="bordered"
                        className="w-full font-bold"
                    >
                        entrar
                    </Button>

                </Form>

                <hr />

                <div className="flex flex-col gap-3">
                    <small className="font-bold">Ainda não tem uma conta? Facin de resolver</small>
                    <Button
                        type="button"
                        color="secondary"
                        variant="bordered"
                        onPress={() => router.push("/sign-up")}
                    >

                        criar conta
                    </Button>

                </div>
            </div>
        </div>
        // </main>
    );
}