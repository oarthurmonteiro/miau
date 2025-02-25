import LionSvg from "./lion.svg";
import "./Logo.css";

export function Logo() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: "1.5rem",
				color: "#37455A",
			}}
		>
			<LionSvg />
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "start",
					fontWeight: "bold",
				}}
			>
				<div
					style={{
						fontFamily: "coiny",
						fontSize: "2rem",
					}}
				>
					<span style={{ color: "#FFC2C2" }}>Mi</span>
					<span style={{ color: "#F8CD0E" }}>Au</span>
				</div>
				<span style={{ fontFamily: "fustat", fontSize: "1.5rem" }}>cofrin</span>
			</div>
		</div>
	);
}
