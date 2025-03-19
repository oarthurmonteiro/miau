import EnterKey from "@assets/enter-key.svg";
import LeftChevron from "@assets/left-chevron.svg";
import { Button } from "@components/Button";
import { Stepper } from "@components/Stepper";
import { z } from "zod";
import { type FormEvent, useContext, useState } from "react";
import { steps, UserDataContext } from "./UserData";
import { Password as PasswordSchema } from "@lib/types";
import { Alert } from "@components/Alert";

type UserDataCollectionProps = {
    step: number;
    onSubmit: () => void;
    onBack: () => void;
}

export function UserDataForm({ step, onSubmit, onBack }: UserDataCollectionProps) {

    return (

        <div className="w-full flex justify-between">

            <div className="flex flex-col content-start gap-2">

                <Button variant="text" onClick={onBack} classNames="flex content-center gap-4 font-bold">
                    <LeftChevron width={'.65rem'} />
                    <span>Back</span>
                </Button>
                <DataCollect currentStepId={step} onSubmit={onSubmit} />

            </div>

            <div className="w-2/5">
                <Stepper currentStepId={step} steps={steps} />
            </div>
        </div>
    )
}


type DataCollectProps = {
    currentStepId: number,
    onSubmit: () => void
}

function DataCollect({ currentStepId, onSubmit }: DataCollectProps) {

    const { userData, handleUserDataUpdate } = useContext(UserDataContext);
    const [errorMsg, setErrorMsg] = useState('');

    const currentStep = steps.find(({ id }) => id === currentStepId);

    const Component = currentStep?.component;
    if (!currentStep || !Component) return <></>;


    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = new FormData(event.currentTarget);

        const [[key, value]] = payload.entries();

        try {
            switch (key) {
                case 'fullName': {
                    validateFullName(value as string);
                    break;
                }
                case 'password': {
                    validatePassword(value as string);
                    break;
                }

                case 'passwordConfirm': {
                    validatePasswordConfirm(value as string, userData?.password as string);
                    break;
                }
            }

            handleUserDataUpdate({ [key]: value });
            setErrorMsg('');
            onSubmit();
        } catch (err) {
            if (err instanceof Error) setErrorMsg(err.message);
        }

    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col content-start justify-between gap-12">

            <Component />

            {errorMsg && <Alert message={errorMsg} variant="danger" />}

            <div className="flex content-center gap-6">
                <Button
                    htmlType="submit"
                    color="primary"
                    size="lg"
                    text="next"
                    shape="pill" />

                <div className="flex items-center gap-3">
                    <div className="bg-secondary rounded-lg p-2 flex items-center">
                        <EnterKey />
                    </div>
                    <span>Or press Enter</span>
                </div>
            </div>
        </form>
    )
}

const validateFullName = (fullName: string): boolean => {
    const validSchema = z.string().regex(/^[A-Za-z'-]{2,16} [\S ]{2,64}$/);
    if (false === validSchema.safeParse(fullName).success) {
        throw new Error("Full names are expected to have at least two words with more than 2 chars")
    }

    return true;
}

const validatePassword = (password: string): boolean => {
    const safedPassword = PasswordSchema.safeParse(password)
    if (false === safedPassword.success) {
        throw new Error("Your secret it's not on format expected by us");
    }

    return true;
}

const validatePasswordConfirm = (passwordConfirm: string, password: string): boolean => {
    if (passwordConfirm !== password) {
        throw new Error("It's different from previous password");
    }

    return true;
}