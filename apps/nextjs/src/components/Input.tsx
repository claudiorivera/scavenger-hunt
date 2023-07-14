import classNames from "classnames";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

type InputProps = DetailedHTMLProps<
	InputHTMLAttributes<HTMLInputElement>,
	HTMLInputElement
> & {
	label?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
	const { label, type, ...inputProps } = props;

	return (
		<>
			<label className="label flex flex-col items-stretch gap-1">
				<span className="label-text">{label ?? ""}</span>
				<input
					ref={ref}
					{...inputProps}
					type={type ?? "text"}
					className={classNames(
						{
							"input input-bordered": type !== "checkbox" && type !== "file",
						},
						{
							toggle: type === "checkbox",
						},
					)}
				/>
			</label>
		</>
	);
});

Input.displayName = "Input";
