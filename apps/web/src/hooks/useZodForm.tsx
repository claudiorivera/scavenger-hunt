import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import { useForm, useFormContext } from "react-hook-form";
import type { z } from "zod";

type UseZodForm<TInput extends FieldValues> = UseFormReturn<TInput> & {
	/**
	 * A unique ID for this form.
	 */
	id: string;
};
export function useZodForm<TSchema extends z.ZodType>(
	props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
		schema: TSchema;
	},
) {
	const form = useForm<TSchema["_input"]>({
		...props,
		resolver: zodResolver(props.schema, undefined, {
			// This makes it so we can use `.transform()`s on the schema without same transform getting applied again when it reaches the server
			raw: true,
		}),
	}) as UseZodForm<TSchema["_input"]>;

	form.id = useId();

	return form;
}

export function useZodFormContext<TSchema extends z.ZodType>() {
	return useFormContext<TSchema["_input"]>();
}
