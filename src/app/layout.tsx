import type { Metadata } from "next";
import { Roboto, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";

const gilroy = localFont({
  src: [
    {
      path: "../../public/fonts/gilroy400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/gilroy500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/gilroy700.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-gilroy",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "High Tribe",
  description: "High Tribe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${gilroy.variable} ${roboto.variable} ${poppins.variable} font-gilroy antialiased`}
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
