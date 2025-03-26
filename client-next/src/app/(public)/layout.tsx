'use client'

import { Logo } from "@/components/Logo"

type Props = {
    children: React.ReactNode,
}

export default function Layout({ children }: Props) {

    return (
        <div className="flex flex-col h-screen px-32">
            <header className="py-5 flex justify-between">
                <Logo />
                <div>
                    {/* <CustomButon shape="pill" color="secondary" text="help" /> */}
                </div>
            </header>

            <main className="grow content-center">
                {children}
            </main>

            <footer className="h-20 flex gap-8 justify-end items-center">
                <a href="#Privacy">Privacy Policy</a>
                <a href="#Terms">Terms of Service</a>
            </footer>
        </div>
    )
}