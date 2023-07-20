import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext, type UseFormProps } from "react-hook-form";
import { type z } from "zod";

export function useZodForm<TSchema extends z.ZodType>(
	props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
		schema: TSchema;
	},
) {
	const form = useForm<TSchema["_input"]>({
		...props,
		resolver: zodResolver(props.schema, undefined),
	});

	return form;
}

export function useZodFormContext<TSchema extends z.ZodType>() {
	return useFormContext<TSchema["_input"]>();
}
