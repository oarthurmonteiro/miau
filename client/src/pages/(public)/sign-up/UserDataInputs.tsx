import { Input, InputPassword } from "@components/Input";
import { useContext, useState } from "react";
import { UserDataContext } from "./UserData";

export function FullName() {

    const { userData } = useContext(UserDataContext);
    const [fullName, setFullName] = useState(userData?.fullName);

    return (
        <>
            <label
                htmlFor="fullName"
                className="text-4xl font-bold"
            >
                Your Full Name
            </label>

            <Input
                required
                name="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                variant="borderless"
                styles={{
                    width: "100%",
                    fontSize: "3rem",
                    fontWeight: "bold",
                }} />
        </>
    )
}

export function Password() {

    const { userData } = useContext(UserDataContext);
    const [password, setPassword] = useState(userData?.password);


    return (
        <>
            <label
                htmlFor="password"
                className="text-4xl font-bold"
            >
                Your Top Secret Password
            </label>

            <InputPassword
                required
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
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

export function ConfirmPassword() {

    return (
        <>
            <label
                htmlFor="passwordConfirm"
                className="text-4xl font-bold"
            >
                Your Top Secret Password (Confirm)
            </label>

            <InputPassword
                required
                name="passwordConfirm"
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