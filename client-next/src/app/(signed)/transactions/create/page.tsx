'use client'

import { request } from "@/app/lib/client";
import { Account, Transaction } from "@/app/lib/models";
import { useMutation, useQuery } from "@tanstack/react-query";
import TransactionForm from "./form";
import { addToast, Spinner } from "@heroui/react";
import { FormEvent } from "react";

export default function Page() {

  const { data: accounts, isPending } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => request<Account[]>('/api/v1/accounts', {
      credentials: 'include'
    }),
  });

  const { mutate } = useMutation({
    mutationKey: ['transactions'],
    mutationFn: (payload: FormData) =>
      request<Transaction>('/api/v1/transactions', {
        method: 'POST',
        payload
      }),
    onError: (error: Error) => {
      addToast({
        title: "Falha na solicitação",
        description: error.message || "Não conseguimos salvar sua transação.",
        color: 'danger',
      });
    }
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // console.log(e)
    const payload = new FormData(e.currentTarget);
    // console.log(payload)
    // alert(JSON.stringify(payload))
    mutate(payload);
  }

  if (isPending) return <Spinner />
  return (
    <TransactionForm
      accounts={accounts?.body ?? []}
      onSubmit={handleSubmit}
    />
  )
}
