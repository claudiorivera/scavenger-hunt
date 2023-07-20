import classNames from "classnames";
import {
	forwardRef,
	type DetailedHTMLProps,
	type InputHTMLAttributes,
} from "react";

export const Input = forwardRef<
	HTMLInputElement,
	DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
		label?: string;
		error?: string;
	}
>((props, ref) => {
	const { label, type, error, ...inputProps } = props;

	return (
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
			{error && <p className="text-error">{error}</p>}
		</label>
	);
});

Input.displayName = "Input";
