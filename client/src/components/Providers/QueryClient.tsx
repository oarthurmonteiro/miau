import { QueryClientProvider, QueryClient as QC } from "@tanstack/react-query";

const queryClient = new QC();

export function QueryClient({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}