import { createTRPCReact } from "@trpc/react-query";

import type { AppRouter } from "@claudiorivera/api";

export const api = createTRPCReact<AppRouter>();

export type { RouterInputs, RouterOutputs } from "@claudiorivera/api";
