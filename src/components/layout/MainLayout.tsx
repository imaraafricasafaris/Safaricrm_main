import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '../api/ErrorBoundary';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => window.innerWidth < 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarCollapsed(mobile);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex relative">
        {/* Sidebar */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <div 
          className={`
            flex-1 flex flex-col min-h-screen 
            transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? 'ml-0 md:ml-16' : 'ml-0 md:ml-56 lg:ml-64'}
          `}
        >
          <Header 
            onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMobileMenuOpen={isMobileMenuOpen}
          />
          <main className="flex-1 p-4 mt-24">
            <div 
              className={`
                mx-auto w-full transition-all duration-300 px-4 sm:px-6 lg:px-8
                ${isMobile ? 'max-w-full' : isSidebarCollapsed ? 'max-w-7xl' : 'max-w-6xl'}
              `}
            >
              <div className="grid auto-rows-auto gap-4 md:gap-6">
                {children}
              </div>
            </div>
          </main>
        </div>

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  );
}