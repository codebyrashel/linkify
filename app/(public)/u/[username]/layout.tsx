import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Link in Bio",
  description: "Public Link in Bio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}