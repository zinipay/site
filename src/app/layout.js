import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head></head>
      <body className={`${inter.className} bg-white`}>
        <Toaster position="top-center" richColors />
        <main>{children}</main>
      </body>
    </html>
  );
}
