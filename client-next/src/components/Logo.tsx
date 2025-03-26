import LionSvg from "@assets/svg/lion.svg";

export function Logo() {
	return (
		<div className="flex items-center gap-6 text-dark">
			<LionSvg />
			<div className="flex flex-col align-start font-bold">
				<div className={`font-[coiny] text-4xl`} >
					<span className="text-secondary">Mi</span>
					<span className="text-primary">Au</span>
				</div>
				<span className="text-2xl">cofrin</span>
			</div>
		</div>
	);
}
