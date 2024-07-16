import ClientProviders from "@/providers/client";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

export const metadata = {
  title: "OSSDonate",
  description: "Supporting OSS projects with Celo.",
};

const Layout = ({ children }: any) => {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        // className={`${inter.className} ${caveat.className} ${dmSans.className}`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
};

export default Layout;
