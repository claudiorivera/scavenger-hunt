import classNames from "classnames";

type Props = {
	isOpen: boolean;
	title: string;
	children: React.ReactNode;
	modalAction: JSX.Element;
};

export function Dialog({ isOpen, title, children, modalAction }: Props) {
	return (
		<div>
			<div
				className={classNames("modal", {
					"modal-open": isOpen,
				})}
			>
				<div className="modal-box">
					<h3 className="text-lg font-bold">{title}</h3>
					{children}
					<div className="modal-action">{modalAction}</div>
				</div>
			</div>
		</div>
	);
}