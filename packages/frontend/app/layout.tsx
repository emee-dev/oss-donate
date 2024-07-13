import ClientProviders from "@/providers/client";
import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
// import { Inter, Caveat, DM_Sans } from "next/font/google";

// const caveat = Caveat({
//   weight: "700",
//   // subsets: [""],
//   display: "swap",
//   preload: false,
// });

// const dmSans = DM_Sans({
//   weight: ["400", "500", "700"],
//   // subsets: ["latin"],
//   display: "swap",
//   preload: false,
// });

// const inter = Inter({
//   weight: "800",
//   // subsets: ["latin"],
//   display: "swap",
//   preload: false,
// });

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
