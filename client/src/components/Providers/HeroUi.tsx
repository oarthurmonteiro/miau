import { HeroUIProvider, ToastProvider } from "@heroui/react";

import { ReactNode } from "react";

export function HeroUI(props: AppProviderProps) {

    const { children, className } = props;

    return (
        <HeroUIProvider locale="pt-BR" className={className}>
            <ToastProvider />
            {children}
        </HeroUIProvider>
    )
}

interface AppProviderProps {
    children: ReactNode;
    className?: string;
}