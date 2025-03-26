'use client'

import { request } from "@/app/lib/client"
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";


type Accounts = {
    id: number,
    name: string,
    initialBalance: number,
    currentBalance: number,
    type: string,
}

export default function Page() {



    return (
        <>
            <h1>Contas</h1>
            <AccountList />
        </>
    )
}

function AccountList() {

    const accountQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => request<Accounts[]>('/api/v1/accounts', {
            credentials: 'include'
        }),
    })

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
            {/* 
            <CardFooter className="text-small justify-between">
                <b>{item.title}</b>
                <p className="text-default-500">{item.price}</p>
            </CardFooter>  */}
        </Card>
    ))
}
