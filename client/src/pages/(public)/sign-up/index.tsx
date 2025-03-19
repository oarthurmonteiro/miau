import { Button } from "@components/Button";
import { Logo } from "@components/Logo";
import { request } from "@lib/client";
import { DefaultUserData, steps, UserDataContext, type UserDataType } from "./UserData";
import { useState } from "react";
import { EmailValidation } from "./EmailValidation";
import { UserDataForm } from "./UserDataForm";
import "./Register.css"

function Main() {

	const [step, setStep] = useState(1);
	const [userData, setUserData] = useState(DefaultUserData)

	function handleUserDataUpdate({ email, fullName, password }: Partial<UserDataType>) {
		const newUserData = { ...userData };
		if (email) newUserData.email = email;
		if (fullName) newUserData.fullName = fullName;
		if (password) newUserData.password = password;

		setUserData(newUserData);
	}

	async function handleStepToForward() {
		const nextStep = step + 1;

		if (nextStep > steps.length) {
			await postRegister(userData);
			return;
		}

		setStep(nextStep);
	}

	function handleStepToBack() {
		setStep(step - 1);
	}

	return (
		<main className="grow">
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

async function postRegister(user: UserDataType) {
	const fullName = user.fullName.replace(
		/\w\S*/g,
		text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
	);

	const [firstName, ...lastName] = fullName.split(' ');

	const payload = {
		email: user.email,
		password: user.password,
		lastName: lastName.join(' '),
		firstName,
	};

	const response = await request('http://localhost:3000/api/v1/auth/signup', {
		method: 'POST',
		payload
	})

	console.log(response)
}

export function Register() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "0 8rem",
				gap: '5rem',
				height: "100vh",
			}}
		>
			<header className="register-header">
				<Logo />
				<div>
					<Button shape="pill" color="secondary" text="help" />
				</div>
			</header>

			<Main />

			<footer className="register-footer">
				<a href="#Privacy">Privacy Policy</a>
				<a href="#Terms">Terms of Service</a>
			</footer>
		</div>
	);
}
