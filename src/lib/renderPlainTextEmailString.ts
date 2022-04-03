import { appTitle } from "~config";

type Params = {
  url: string;
};
export const renderPlainTextEmailString = ({ url }: Params) =>
  `Sign in to ${appTitle}\n${url}\n\n`;
