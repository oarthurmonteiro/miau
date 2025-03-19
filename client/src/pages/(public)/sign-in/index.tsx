import { Button } from "@components/Button";
import { Logo } from "@components/Logo";
import { Input } from "@components/Input";
import { request } from "@lib/client";
import { useLocation } from "wouter";
import type { FormEvent } from "react";


function Main() {
    const [, navigate] = useLocation();

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = new FormData(event.currentTarget);

        const response = await request('http://localhost:3000/api/v1/auth/signin', {
            method: 'POST',
            payload
        });

        if (response.ok) {
            navigate("/dashboard");
        }
    }

    return (
        <main className="grow content-center">
            <div className="flex justify-around">
                <div className="flex flex-col gap-5 justify-center">
                    <div>
                        <p className='font-bold text-3xl'>Bem-vindx de volta!</p>
                        <p>Bora dar um bisu no din-din?</p>
                    </div>

                    <form onSubmit={handleSubmit}
                        className="flex flex-col gap-4">
                        <Input required autoFocus
                            name="email"
                            type="email"
                            placeholder=""
                            label="E-mail" />

                        <Input required
                            name="password"
                            type="password"
                            placeholder=""
                            label="Password" />

                        <Button htmlType="submit"
                            text="Sign In"
                            color="primary"

                        />
                    </form>

                    <hr />

                    <div className="flex flex-col gap-3">
                        <small className="font-bold">Ainda não tem uma conta? Facin de resolver</small>
                        <Button
                            htmlType="button"
                            text="Sign Up"
                            color="secondary"
                            onClick={() => navigate("/sign-up")} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export function SignIn() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: "0 8rem",
                height: "100vh",
            }}
        >
            <header className="register-header">
                <Logo />
                <div>
                    <Button shape="pill" color="secondary" text="help" />
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
