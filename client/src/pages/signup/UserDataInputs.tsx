import { Input, InputPassword } from "@components/Input";
import { UserDataContext } from "./UserData";
import { useContext, useState } from "react";

export function FullName({ onEnterKey, onError }: { onEnterKey: () => void, onError: (msg: string) => void }) {

    const { userData, handleUserDataUpdate } = useContext(UserDataContext);

    function handleSubmit() {
        if (userData?.fullName === '') {
            return onError("Can't be empty");
        }

        onEnterKey()
    }

    return (
        <>
            <label
                htmlFor=""
                style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                }}
            >
                Your Full Name
            </label>

            <Input
                onEnterKeyPress={handleSubmit}
                onChange={(e) => handleUserDataUpdate({ fullName: e.target.value })}
                value={userData?.fullName}
                variant="borderless"
                styles={{
                    width: "100%",
                    fontSize: "3rem",
                    fontWeight: "bold",
                }} />
        </>
    )
}

export function Password({ onEnterKey }: { onEnterKey: () => void }) {

    const { userData, handleUserDataUpdate } = useContext(UserDataContext);

    return (
        <>
            <label
                htmlFor=""
                style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                }}
            >
                Your Top Secret Password
            </label>

            <InputPassword
                value={userData?.password}
                onChange={(e) => handleUserDataUpdate({ password: e.target.value })}
                onEnterKeyPress={onEnterKey}
                initialVisible={false}
                variant="borderless"
                styles={{
                    width: "100%",
                    fontSize: "3rem",
                    fontWeight: "bold",
                }} />

            <small>At least 12 characters</small>
        </>
    )
}

export function ConfirmPassword({ onEnterKey }: { onEnterKey: () => void }) {
    const { userData } = useContext(UserDataContext);

    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState(false);

    function handlePasswordConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
        const password = e.target.value;

        setPasswordConfirm(password)
        setError(true)

    }

    return (
        <>
            <label
                htmlFor=""
                style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                }}
            >
                Your Top Secret Password (Confirm)
            </label>

            <InputPassword
                value={userData?.password}
                onChange={handlePasswordConfirmChange}
                onEnterKeyPress={onEnterKey}
                initialVisible={false}
                variant="borderless"
                styles={{
                    width: "100%",
                    fontSize: "3rem",
                    fontWeight: "bold",
                }} />

            <small>Must be the same inserted before</small>
        </>
    )


}