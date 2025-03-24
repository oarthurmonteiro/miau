import { HeroUIProvider, ToastProvider } from "@heroui/react";

export function HeroUI({ children }: { children: React.ReactNode }) {
    return (
        <HeroUIProvider>
            <ToastProvider />
            {children}
        </HeroUIProvider>
    )
}