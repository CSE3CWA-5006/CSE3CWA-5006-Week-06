import "./styles.css";

export const metadata = {
  title: "Next.js Project Portal",
  description: "Week 6 teaching demo for a full-stack Next.js application."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
