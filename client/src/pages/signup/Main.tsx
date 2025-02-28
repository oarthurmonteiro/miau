
import { useState } from "react";
import { EmailValidation } from "./EmailValidation";
import { UserDataForm } from "./UserDataForm";
import { DefaultUserData, UserDataContext, type UserDataType } from "./UserData";

export function Main() {

    const [step, setStep] = useState(3);

    const [userData, setUserData] = useState(DefaultUserData)

    function handleUserDataUpdate({ email, fullName, password }: Partial<UserDataType>) {
        const newUserData = { ...userData };
        if (email) newUserData.email = email;
        if (fullName) newUserData.fullName = fullName;
        if (password) newUserData.password = password;

        setUserData(newUserData);
    }

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
            <UserDataContext.Provider value={{ userData, handleUserDataUpdate }}>
                {
                    step === 1
                        ? <EmailValidation
                            onSubmit={handleStepToForward}
                        />
                        : <UserDataForm
                            step={step}
                            onSubmit={handleStepToForward}
                            onBack={handleStepToBack}
                        />

                }
            </UserDataContext.Provider>
        </main>
    );
}
