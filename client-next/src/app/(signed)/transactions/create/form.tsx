// 'use client';

import { Account } from "@/app/lib/models";
import { Button, cn, DatePicker, Form, Input, NumberInput, Radio, RadioGroup, RadioProps, Select, SelectItem } from "@heroui/react";
import { FormEvent } from "react";

export default function TransactionForm({ accounts, onSubmit }: {
    accounts: Account[],
    onSubmit: (e: FormEvent<HTMLFormElement>) => void,
    // onSubmit: (payload: FormData) => void
}) {
    const CustomRadio = (props: RadioProps) => {
        const { children, ...otherProps } = props;

        return (
            <Radio
                {...otherProps}
                classNames={{
                    base: cn(
                        "flex-none m-0 h-8 bg-content1 hover:bg-content2 items-center justify-between",
                        "cursor-pointer rounded-full border-2 border-default-200/60",
                        "data-[selected=true]:border-primary",
                    ),
                    label: "text-tiny text-default-500",
                    labelWrapper: "px-1 m-0",
                    wrapper: "hidden",
                }}
            >
                {children}
            </Radio>
        );
    };


    return (
        <Form
            className="w-full max-w-xs flex flex-col gap-4"
            onSubmit={onSubmit}
        >

            <RadioGroup
                name="type"
                isRequired
                aria-label="Date precision"
                label="Tipo"
                classNames={{
                    base: "w-full pb-2",
                    wrapper: "gap-1 flex-nowrap max-w-[380px]",
                }}
                orientation="horizontal"
            >
                <CustomRadio value="expense">Despesa</CustomRadio>
                <CustomRadio value="income">Receita</CustomRadio>
                <CustomRadio value="transfer">Transferência</CustomRadio>
            </RadioGroup>

            <Input
                name="description"
                isRequired
                errorMessage="Insert a valid description for the transaction"
                label="Nome"
                labelPlacement="outside"
                placeholder="Digite algo descritivo"
                type="text"
            />

            <Select
                name="accountId"
                isRequired
                className="max-w-xs"
                items={accounts}
                labelPlacement="outside"
                label="Conta"
                placeholder="Secione uma conta"
            >
                {(account) => <SelectItem key={account.id} textValue={account.name}>{account.name}</SelectItem>}
            </Select>

            <NumberInput
                isRequired
                labelPlacement="outside"
                label="Valor"
                name="amount"
                hideStepper
                formatOptions={{
                    style: "currency",
                    currency: "BRL",
                }}
                placeholder="0.00"
                validate={(value) => {
                    if (value <= 0) {
                        return "Number must be positive non nullish";
                    }
                }}
            />

            <DatePicker
                isRequired
                name="date"
                showMonthAndYearPickers
                // minValue={new Date("2010-01-01")}
                className="max-w-[284px]"
                labelPlacement="outside"
                label="Dia da transação"
            />

            <Button type="submit" variant="bordered">
                Submit
            </Button>

        </Form >
    )
}

// import React, { FormEvent } from "react";
// import { Form, Input, Button } from "@heroui/react";

// export default function TransactionForm({ accounts, onSubmit }: {
//     accounts: Account[],
//     onSubmit: (e: FormEvent<HTMLFormElement>) => void,
// }) {

//     const [action, setAction] = React.useState<string | null>(null);


//     return (
//         <Form
//             className="w-full max-w-xs flex flex-col gap-4"
//             // onSubmit={onSubmit}
//             onSubmit={(e) => {
//                 e.preventDefault();
//                 const payload = new FormData(e.currentTarget);
//                 console.dir(payload);

//                 let data = Object.fromEntries(payload);

//                 console.log(data)
//                 setAction(`submit ${JSON.stringify(data)}`);
//             }}
//         >
//             <Input
//                 isRequired
//                 errorMessage="Please enter a valid username"
//                 label="Username"
//                 labelPlacement="outside"
//                 name="username"
//                 placeholder="Enter your username"
//                 type="text"
//             />

//             <Input
//                 isRequired
//                 errorMessage="Please enter a valid email"
//                 label="Email"
//                 labelPlacement="outside"
//                 name="email"
//                 placeholder="Enter your email"
//                 type="text"
//             />
//             <div className="flex gap-2">
//                 <Button color="primary" type="submit">
//                     Submit
//                 </Button>
//                 <Button type="reset" variant="flat">
//                     Reset
//                 </Button>
//             </div>
//             {action && (
//                 <div className="text-small text-default-500">
//                     Action: <code>{action}</code>
//                 </div>
//             )}
//         </Form>
//     );
// }

