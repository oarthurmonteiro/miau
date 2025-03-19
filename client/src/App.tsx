import { Route } from "wouter";
import { SignIn } from "@pages/(public)/sign-in";
import { Register } from "@pages/(public)/sign-up";

export default function App() {

	return (
		<Route path="/" nest >
			<Route path="/sign-in" component={SignIn} />
			<Route path="/sign-up" component={Register} />
		</Route>
	);
}