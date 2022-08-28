import { appTitle } from "config";

interface Params {
  url: string;
}

export const renderPlainTextEmailString = ({ url }: Params) =>
  `Sign in to ${appTitle}\n${url}\n\n`;
