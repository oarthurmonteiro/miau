import { Button } from "@components/Button";
import { Logo } from "@components/Logo";
import { Main } from "./Main";
import "./Register.css";

export function Register() {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				padding: "0 8rem",
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
