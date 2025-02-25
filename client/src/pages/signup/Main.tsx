
import { useState } from "react";
import { EmailValidation } from "./EmailValidation";
import { UserDataCollection } from "./UserDataCollection";


export function Main() {

    const [step, setStep] = useState(2);

    function handleStepToForward() {
        setStep(step + 1);
    }

    function handleStepToBack() {
        setStep(step - 1);
    }

    return (
        <main
            style={{
                flexGrow: 1,
            }}
        >
            {
                step === 1
                    ? <EmailValidation onSubmit={handleStepToForward} />
                    : <UserDataCollection onSubmit={handleStepToForward} onBack={handleStepToBack} />

            }

        </main>
    );
}