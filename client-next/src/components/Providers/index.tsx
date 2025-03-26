'use client'

import { HeroUI } from "./HeroUi";
import { QueryClient } from "./QueryClient";
import { AuthProvider } from "./Auth";

export function Providers({ children }: { children: React.ReactNode }) {

    return (
        <HeroUI>
            <QueryClient>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </QueryClient>
        </HeroUI>

    )
}