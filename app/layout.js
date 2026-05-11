import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Hatim Zone",
  description: "E-commerce Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 text-gray-800">
       <div z-index="10">
         <Navbar />
       </div>
        <main>{children}</main>
      </body>
    </html>
  );
}