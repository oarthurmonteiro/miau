import { Button as CustomButon } from "@components/Button";
import { Logo } from "@components/Logo";
import { request } from "@lib/client";
import { useLocation } from "wouter";
import type { FormEvent } from "react";

import { Form, Input, Button, Spinner, addToast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function Main() {
    const [, navigate] = useLocation();
    const queryClient = useQueryClient();

    const signInMutation = useMutation({
        mutationKey: ['auth', 'sign-in'],
        mutationFn: (payload: FormData) =>
            request('/api/v1/auth/sign-in', {
                method: 'POST',
                payload
            }),
        onError: (error: Error) => {
            addToast({
                title: "Falha na autenticação",
                description: error.message || "Não conseguimos te localizar. Verifique suas credenciais e tente novamente.",
                color: 'warning',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            navigate('/dashboard')
        }
    })

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = new FormData(event.currentTarget);

        signInMutation.mutate(payload);
    }

    if (signInMutation.isPending) {
        return (
            <main className="grow content-center flex justify-center">
                <Spinner size="lg" variant="wave" />
            </main>
        );
    }

    return (
        <main className="grow content-center">
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
                            onPress={() => navigate("/sign-up")}
                        >
                            criar conta
                        </Button>

                    </div>
                </div>
            </div>
        </main>
    );
}

export function SignIn() {
    return (
        <div className="flex flex-col h-screen px-32">
            <header className="register-header">
                <Logo />
                <div>
                    <CustomButon shape="pill" color="secondary" text="help" />
                </div>
            </header>

            <Main />

            <footer className="register-footer">
                <a href="#Privacy">Privacy Policy</a>
                <a href="#Terms">Terms of Service</a>
            </footer>
        </div>
    );
}
