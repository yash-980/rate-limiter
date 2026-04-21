import "./globals.css";

export const metadata = {
  title: "Rate Limit SaaS",
  description: "A beginner-friendly rate limiting SaaS dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
