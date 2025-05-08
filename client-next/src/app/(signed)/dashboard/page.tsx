'use client'

import { request } from "@/app/lib/client"
import { addToast, Button, Card, CardBody, CardHeader, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, NumberInput, useDisclosure } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { DeleteModal } from "@/components/DeleteModal";

type Account = {
    id: number,
    name: string,
    initialBalance: number,
    currentBalance: number,
    type: string,
}

export default function Page() {

    return (
        <>
            <h1 className="text-3xl font-bold pb-8">Contas</h1>
            <main className="">

                <CreateAccountModal />
                <div className="flex justify-between">
                    <AccountList />

                    {/* <AccountForm isNew isInitialOpen /> */}
                </div>

            </main>
        </>
    )
}

function AccountModal({ account, isOpen, isPending, onOpenChange, onClose, mutate }: {
    account?: Account,
    isOpen: boolean,
    isPending: boolean,
    onOpenChange: () => void,
    onClose: () => void,
    mutate: (payload: FormData) => void,
}) {

    const [name, setName] = useState(account?.name)
    const [initialBalance, setInitialBalance] = useState(account?.initialBalance)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = new FormData(event.currentTarget);

        mutate(payload);
    }

    return (
        <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    {
                        account
                            ? 'editar conta'
                            : 'criar conta'
                    }
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <Input
                            name="name"
                            label="Nome"
                            placeholder="ex. Cofrin, Caixa, Itaú, Nubank..."
                            variant="bordered"
                            value={name}
                            onValueChange={(newName) => setName(newName)}
                            required
                        />
                        <NumberInput
                            name="initialBalance"
                            label="Saldo inicial"
                            variant="bordered"
                            value={initialBalance}
                            onValueChange={(newInitialBalance) => setInitialBalance(newInitialBalance)}
                            hideStepper
                            required
                            formatOptions={{
                                style: "currency",
                                currency: "BRL",
                            }}
                        />
                        <div className="py-4 w-full flex justify-end gap-2">
                            <Button color="danger" variant="flat" onPress={onClose}>
                                cancelar
                            </Button>
                            <Button color="primary" type="submit" isLoading={isPending}>
                                salvar
                            </Button>
                        </div>
                    </Form>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}

function CreateAccountModal() {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationKey: ['accounts'],
        mutationFn: (payload: FormData) =>
            request('/api/v1/accounts', {
                method: 'POST',
                payload
            }),
        onError: (error: Error) => {
            addToast({
                title: "Falha na solicitação",
                description: error.message || "Não conseguimos salvar sua nova conta.",
                color: 'danger',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            onClose()
        }
    })

    return (
        <>
            <Button type="submit"
                color="primary"
                className="font-bold text-md"
                onPress={onOpen}
            >
                criar
            </Button>

            <AccountModal
                isOpen={isOpen}
                isPending={isPending}
                onOpenChange={onOpenChange}
                onClose={onClose}
                mutate={mutate} />
        </>
    );
}

function AccountList() {

    const accountQuery = useQuery({
        queryKey: ['accounts'],
        queryFn: () => request<Account[]>('/api/v1/accounts', {
            credentials: 'include'
        }),
    })

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationKey: ['accounts', selectedAccount?.id],
        mutationFn: (payload: FormData) =>
            request('/api/v1/accounts/' + selectedAccount?.id, {
                method: 'PUT',
                payload
            }),
        onError: (error: Error) => {
            addToast({
                title: "Falha na solicitação",
                description: error.message || "Não conseguimos salvar sua conta.",
                color: 'danger',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            onClose()
        },

    })


    function handleOpenAccountModal(account: Account) {
        setSelectedAccount(account);
        onOpen();
    }

    return (
        <div className="flex gap-4">
            {accountQuery.data?.body.map((account) =>
                <AccountCard
                    key={account.id}
                    account={account}
                    showCard={handleOpenAccountModal}
                />)}
            {
                selectedAccount
                && <AccountModal
                    account={selectedAccount}
                    isOpen={isOpen}
                    isPending={isPending}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                    mutate={mutate} />
            }
        </div>
    )
}

function AccountCard({ account, showCard }: { account: Account, showCard: (account: Account) => void }) {

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [isHovering, setIsHovering] = useState(false);

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationKey: ['accounts', account.id],
        mutationFn: (payload: FormData) =>
            request('/api/v1/accounts/' + account.id, {
                method: 'PUT',
                payload
            }),
        onError: (error: Error) => {
            addToast({
                title: "Falha na solicitação",
                description: error.message || "Não conseguimos salvar sua conta.",
                color: 'danger',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            onClose()
        }
    })

    const { mutate: deleteAccount, isPending: deleteIsPending } = useMutation({
        mutationKey: ['accounts', account.id],
        mutationFn: (accountId: number) =>
            request('/api/v1/accounts/' + accountId, {
                method: 'DELETE',
            }),
        onError: (error: Error) => {
            addToast({
                title: "Falha na solicitação",
                description: error.message || "Não conseguimos excluir sua conta.",
                color: 'danger',
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        }
    })

    const numberToLocaleCurrency = (value: number) => value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    return (
        <div className="relative">
            <Card
                isPressable
                shadow="sm"
                className="p-2 h-32 w-56 bg-secondary/40"
                onPress={() => showCard(account)}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <CardHeader className="pb-0 pt-2 px-4 flex items-start ">
                    <h4 className="font-bold text-large">{account.name}</h4>

                </CardHeader>
                <CardBody className="overflow-visible ">
                    <div className="flex justify-between gap-2">
                        <span>Saldo inicial</span>
                        <span>R$ {numberToLocaleCurrency(account.initialBalance)}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <span>Saldo atual</span>
                        <span>R$ {numberToLocaleCurrency(account.currentBalance)}</span>
                    </div>
                </CardBody>
            </Card>
            <DeleteModal
                mutate={() => deleteAccount(account.id)}
                isPending={deleteIsPending}
                className={"absolute top-2 right-2" + " "
                    + (isHovering ? 'flex' : 'hidden')
                }
            />
        </div>
    )
}