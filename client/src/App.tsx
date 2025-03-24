import { Redirect, Route, Switch, useLocation } from "wouter";
import { Providers } from "@components/Providers";
import { SignIn } from "@pages/(public)/sign-in";
import { SignUp } from "@pages/(public)/sign-up";
import { Dashboard } from "@pages/(signed)/dashboard";
import { useQuery } from "@tanstack/react-query";
import { User } from "@lib/models";
import { request } from "@lib/client";
import { Spinner } from "@heroui/react";

function AppRoutes() {

	const { isPending, data } = useQuery({
		queryKey: ['users'],
		queryFn: () => request<User>("/api/v1/users", {}),
		retry: false,
	});

	const [location] = useLocation();

	// Handle loading state properly
	if (isPending) return <LoadingRequest />

	const hasValidSession = Boolean(data?.body?.id);

	const keyToSearch = hasValidSession ? 'public' : 'signed';
	const invalidRoute = routes[keyToSearch].find(({ path }) => location === path);

	if (invalidRoute)
		return <Redirect to="/" />

	return (
		<Switch>
			<Route path="/">
				<Redirect to={hasValidSession ? "/dashboard" : "/sign-in"} />
			</Route>

			{
				routes.public.map(({ path, component }) => {
					return <Route path={path} component={component} key={path} />
				})
			}

			{
				routes.signed.map(({ path, component }) => {
					return <Route path={path} component={component} key={path} />
				})
			}
			{/* 
			<Route path="/dashboard" component={Dashboard} />
			<Route path="/sign-in" component={SignIn} />
			<Route path="/sign-up" component={SignUp} /> */}
		</Switch>
	);
}

const routes = {
	signed: [
		{ path: "/dashboard", component: Dashboard },
	],
	public: [
		{ path: "/sign-in", component: SignIn },
		{ path: "/sign-up", component: SignUp },
	]
}

function LoadingRequest() {
	return (
		<div className="flex justify-center content-center items-center h-screen">
			<Spinner
				classNames={{
					label: "text-foreground mt-4"
				}}
				label="Buscando os trem"
				size="lg"
				variant="dots" />
		</div>
	)
}

export default function App() {

	return (
		<Providers>
			<AppRoutes />
		</Providers>
	);
}