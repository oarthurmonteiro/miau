import { createContext } from "react";

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
