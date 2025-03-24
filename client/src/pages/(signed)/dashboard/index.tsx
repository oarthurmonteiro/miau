import { Logo } from "@components/Logo";
import { Button, Card, CardBody, CardHeader, Divider, User } from "@heroui/react";
import { request } from "@lib/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocation } from "wouter";

type Accounts = {
    id: number,
    name: string,
    initialBalance: number,
    currentBalance: number,
    type: string,
}

type User = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
}

export function Dashboard() {

    const [, navigate] = useLocation();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationKey: ['auth', 'sign-out'],
        mutationFn: () =>
            request('/api/v1/auth/sign-out', { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            navigate('/dashboard')
        }

    });


    const userQuery = useQuery({
        queryKey: ['users'],
        queryFn: () => request<User>('/api/v1/users', {}),
        select: (data) => data?.body
    })

    const user = userQuery.data;

    const accountQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => request<Accounts[]>('/api/v1/accounts', {
            credentials: 'include'
        }),
        enabled: !!user,
    })

    return (
        <div className="flex h-screen w-screen border">
            <nav className="flex flex-col w-1/6 px-4 py-3.5 border items-center gap-3">
                <Logo />

                <Divider />

                <div className="grow w-full border">
                    <div>Rotas</div>
                </div>
                <div>
                    <Button onPress={() => mutate()} >Sair</Button>
                </div>
            </nav>
            <main className="grow flex flex-col px-10">
                <header className="border-b h-28 flex justify-end">
                    <User
                        avatarProps={{
                            // src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                            src: "https://avatars.githubusercontent.com/u/65921007",
                        }}
                        description={user?.email}
                        name={`${user?.firstName} ${user?.lastName}`}
                    />
                </header>
                <main className="grow py-8">
                    <h1>Contas</h1>
                </main>
            </main>
        </div>
    )

    console.log(accountQuery.data?.headers);
    return accountQuery.data?.body.map((account) => (
        <Card
            key={account.id}
            isPressable
            shadow="sm"
            onPress={() => console.log("item pressed")}
        >
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                <h4 className="font-bold text-large">{account.name}</h4>
            </CardHeader>
            <CardBody className="overflow-visible p-0">
                <div>
                    <span>Saldo inicial</span>
                    <span>R$ {account.initialBalance}</span>
                </div>
                <div>
                    <span>Saldo atual</span>
                    <span>R$ {account.currentBalance}</span>
                </div>
            </CardBody>
            {/* <CardFooter className="text-small justify-between">
                <b>{item.title}</b>
                <p className="text-default-500">{item.price}</p>
            </CardFooter> */}
        </Card>
    ))
}