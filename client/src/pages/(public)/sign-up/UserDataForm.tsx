import EnterKey from "@assets/enter-key.svg";
import LeftChevron from "@assets/left-chevron.svg";
import { Stepper } from "@components/Stepper";
import { type FormEvent, useContext } from "react";
import { steps, UserDataContext } from "./UserData";
import { Button, Form } from "@heroui/react";

type UserDataCollectionProps = {
    step: number;
    onSubmit: () => void;
    onBack: () => void;
}

export function UserDataForm({ step, onSubmit, onBack }: UserDataCollectionProps) {

    return (

        <div className="w-full flex justify-between gap-16">

            <div className="flex flex-col content-start gap-10 transition-opacity">

                <Button
                    color="secondary" variant="flat"
                    startContent={<LeftChevron width={'.65rem'} />}
                    className="w-fit font-bold p-0 text-tertiary"
                    onPress={onBack}
                >
                    Back
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

    const { handleUserDataUpdate } = useContext(UserDataContext);

    const currentStep = steps.find(({ id }) => id === currentStepId);

    const Component = currentStep?.component;
    if (!currentStep || !Component) return <></>;


    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const payload = new FormData(event.currentTarget);

        const [[key, value]] = payload.entries();

        handleUserDataUpdate({ [key]: value });
        onSubmit();
    }

    return (
        <Form
            onSubmit={handleSubmit}
            className="grow flex flex-col content-start justify-between ">

            <Component />

            <div className="flex content-center gap-6">

                <Button
                    type="submit"
                    radius="full"
                    color="primary"
                    size="lg"
                    className="text-xl"
                    variant="bordered"
                >
                    próximo
                </Button>

                <div className="flex items-center gap-3">
                    <div className="bg-secondary rounded-lg p-2 flex items-center">
                        <EnterKey />
                    </div>
                    <span>Or press Enter</span>
                </div>
            </div>
        </Form>
    )
}
