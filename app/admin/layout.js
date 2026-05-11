'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiBox,
  FiSettings,
  FiLogOut,
  FiHome,
} from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin');
      } finally {
        setLoading(false);
      }
    };

    const publicPaths = ['/admin', '/admin/forgot-password'];
    
    if (!publicPaths.includes(pathname)) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsAuthenticated(false);
      router.push('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/admin');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FiGrid },
    { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
    { name: 'Products', href: '/admin/products', icon: FiBox },
    { name: 'Categories', href: '/admin/categories', icon: FiGrid },
    { name: 'Customers', href: '/admin/users', icon: FiUsers },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  // If we are on the login page or forgot password page, don't show the sidebar/header
  if (pathname === '/admin' || pathname === '/admin/forgot-password') {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">

        <div className="p-6">
          <Link
            href="/"
            className="text-2xl font-bold text-black flex items-center gap-2"
          >
            <span className="w-8 h-8 bg-black rounded-lg"></span>
            ADMIN
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="text-xl" />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all mb-2"
          >
            <FiHome className="text-xl" />

            <span className="font-medium">
              Back to Store
            </span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
          >
            <FiLogOut className="text-xl" />

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="font-semibold text-gray-800">
            {navItems.find(
              (item) => item.href === pathname
            )?.name || 'Dashboard'}
          </h2>

          <div className="w-9 h-9 rounded-full bg-gray-300"></div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
