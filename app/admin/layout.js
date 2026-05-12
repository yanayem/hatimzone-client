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
  FiMenu,
  FiX,
} from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    // Check authentication
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/verify', {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal
        });
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Auth check failed:', error);
          router.push('/admin');
        }
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

    return () => controller.abort();
  }, [pathname, router]);

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

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
    // { name: 'Categories', href: '/admin/categories', icon: FiGrid },
    // { name: 'Customers', href: '/admin/users', icon: FiUsers },
    // { name: 'Settings', href: '/admin/settings', icon: FiSettings },
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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* Sidebar Overlay (Mobile only) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        <div className="p-6 text-xl font-extrabold text-green-600 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className='text-black'>HatimZone</span> ADMIN
          </div>
          <button 
            className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX className="text-2xl" />
          </button>
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
          {/* <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all mb-2"
          >
            <FiHome className="text-xl" />

            <span className="font-medium">
              Back to Store
            </span>
          </Link> */}

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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu className="text-2xl" />
            </button>
            <h2 className="font-semibold text-gray-800 truncate">
              {navItems.find(
                (item) => item.href === pathname
              )?.name || 'Dashboard'}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* You can add user profile or notifications here later */}
          </div>
        </header>

        <main className="p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
