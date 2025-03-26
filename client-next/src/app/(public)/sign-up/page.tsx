'use client'

import { request } from "@/app/lib/client";
import { DefaultUserData, steps, UserDataContext, type UserDataType } from "./UserData";
import { useState } from "react";
import { EmailValidation } from "./EmailValidation";
import { UserDataForm } from "./UserDataForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

import "./Register.css"

export default function Page() {

	const router = useRouter()
	const queryClient = useQueryClient();

	const registerMutation = useMutation({
		mutationKey: ['auth', 'sign-up'],
		mutationFn: (userData: UserDataType) => {
			const fullName = userData.fullName.replace(
				/\w\S*/g,
				text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
			);

			const [firstName, ...lastName] = fullName.split(' ');

			const payload = {
				email: userData.email,
				password: userData.password,
				lastName: lastName.join(' '),
				firstName,
			};

			return request('http://localhost:3000/api/v1/auth/sign-up', {
				method: 'POST',
				payload
			})
		},
		onError: (error: Error) => {
			addToast({
				title: "Falha na autenticação",
				description: error.message || "Deu um probleminha no seu registro...",
				color: 'danger',
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			router.push('/dashboard');
		}
	})

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
			registerMutation.mutate(userData);
			return;
		}

		setStep(nextStep);
	}

	function handleStepToBack() {
		setStep(step - 1);
	}

	if (registerMutation.isPending) return (
		<Spinner
			size="lg"
			variant="wave"
			className="flex justify-center"
		/>
	)

	return (
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
	);
}

