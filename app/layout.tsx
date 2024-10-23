import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rero",
  description: "India\'s first Remote Robotics Laboratory",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
