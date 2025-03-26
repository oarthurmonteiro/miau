'use client'

import { createContext } from "react";
import { ConfirmPassword, FullName, Password } from "./UserDataInputs";

export const DefaultUserData = {
	email: "",
	fullName: "",
	password: "",
};

export type UserDataType = typeof DefaultUserData;

type UserDataContext = {
	userData: UserDataType | null;
	handleUserDataUpdate: (data: Partial<UserDataType>) => void;
};

export const UserDataContext = createContext<UserDataContext>({
	userData: DefaultUserData,
	handleUserDataUpdate: () => {},
});

export const steps = [
    { id: 1, description: "Terms consent and an email to we keep in touch" },
    {
        id: 2,
        description: "How do you prefer we call you?",
        component: FullName
    },
    {
        id: 3,
        description: "Your secret password (We will keep in safe)",
        component: Password
    },
    {
        id: 4,
        description: "We need you to confirm your password",
        component: ConfirmPassword
    },
];