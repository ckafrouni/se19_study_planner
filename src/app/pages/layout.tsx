import { Html } from "@elysiajs/html";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({ children }: { children: JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <title>SE19 Study Planner</title>
        <link rel="stylesheet" href="/public/style.css" />
        <link rel="shortcut icon" href="/public/favicon.png" type="image/png" />
      </head>
      <body
        class={"absolute w-full h-screen flex flex-col justify-between pt-16"}
      >
        <Navbar class="fixed top-0" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
