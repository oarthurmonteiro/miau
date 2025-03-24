import { HeroUI } from "./HeroUi";
import { QueryClient } from "./QueryClient";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <HeroUI>
            <QueryClient>
                {children}
            </QueryClient>
        </HeroUI>

    )
}