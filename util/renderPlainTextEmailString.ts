import { appTitle } from "config";

interface Params {
  url: string;
}

const renderPlainTextEmailString = ({ url }: Params): string =>
  `Sign in to ${appTitle}\n${url}\n\n`;

export default renderPlainTextEmailString;
