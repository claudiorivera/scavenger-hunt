interface Params {
  url: string;
}

export const renderPlainTextEmailString = ({ url }: Params) =>
  `Sign in to Scavenger Hunt\n${url}\n\n`;
