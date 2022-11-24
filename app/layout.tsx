import "./global.css";

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="container mx-auto">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
