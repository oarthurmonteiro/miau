import { Button } from "@components/Button";
import EnterKey from "@assets/enter-key.svg";
import LeftChevron from "@assets/left-chevron.svg";
import { Stepper } from "@components/Stepper";
import { ConfirmPassword, FullName, Password } from "./UserDataInputs";
import { useState } from "react";

const steps = [
    { id: 1, description: "Terms consent and an email to we keep in touch" },
    { id: 2, description: "How do you prefer we call you?", component: FullName },
    { id: 3, description: "Your secret password (We will keep in safe)", component: Password },
    { id: 4, description: "We need that you confirm your password", component: ConfirmPassword },
];

type UserDataCollectionProps = {
    step: number;
    onSubmit: () => void;
    onBack: () => void;
}

export function UserDataForm({ step, onSubmit, onBack }: UserDataCollectionProps) {

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            marginTop: '10rem',
        }}>
            <Button variant="text" onClick={onBack} styles={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontWeight: 'bold',
            }}>
                <LeftChevron />
                <span style={{
                    paddingTop: '0.14375rem'
                }}>Back</span>
            </Button>

            <div style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
            }}>

                <DataCollect currentStep={step} onSubmit={onSubmit} />
                <div style={{
                    width: '40%',
                }}>
                    <Stepper currentStepId={step} steps={steps} />
                </div>
            </div>
        </div>
    )
}


type DataCollectProps = {
    currentStep: number,
    onSubmit: () => void
}

function DataCollect({ currentStep, onSubmit }: DataCollectProps) {

    const [errorMsg, setErrorMsg] = useState('asdada');

    function handleErrorMsg(message: string) {
        setErrorMsg(message);
    }

    function handleSubmit() {
        if (errorMsg) return

        setErrorMsg('')
        onSubmit();

    }

    const Component = steps.find(({ id }) => id === currentStep)?.component

    if (!Component) return <></>

    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "space-around",
        gap: "3rem",
    }}>

        <Component onEnterKey={handleSubmit} onError={handleErrorMsg} />

        <div style={{ color: 'red' }}>{errorMsg}</div>

        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
        }}>
            <Button color="primary" size="lg" shape="pill" onClick={handleSubmit}>
                Next
            </Button>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.75rem'
            }}>
                <div style={{
                    backgroundColor: '#FFC2C2',
                    borderRadius: '.5rem',
                    padding: '.5rem',
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <EnterKey />
                </div>
                <span>Or press Enter</span>
            </div>
        </div>
    </div>
}