export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <h1 className="text-3xl font-bold pb-8">Transações</h1>

            {children}
        </>
    )
}