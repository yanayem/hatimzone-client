import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Hatim Zone",
  description: "E-commerce Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 text-gray-800">

        {/* NAVBAR */}
        <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-6">

            <Link href="/" className="text-xl font-bold text-gray-800">
              Hatim Zone
            </Link>

            <div className="hidden md:flex gap-5 text-gray-700">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <Link href="/shop" className="hover:text-gray-900">Shop</Link>
              <Link href="/about" className="hover:text-gray-900">About</Link>
              <Link href="/contact" className="hover:text-gray-900">Contact</Link>
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-5 text-gray-800 text-xl">

            <Link href="/wishlist">♡</Link>

            <Link href="/cart" className="relative">
              🛒
              <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs px-1 rounded-full">
                2
              </span>
            </Link>

            <Link href="/account">👤</Link>

          </div>

        </nav>

        <main>{children}</main>

      </body>
    </html>
  );
}