import "~/app/global.css";

import { Providers } from "~/app/providers";
import { MainAppBar } from "~/components";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <MainAppBar />
          <main className="container max-w-md mx-auto p-8 text-center">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
