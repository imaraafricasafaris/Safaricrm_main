import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function TopNav() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      isDarkMode 
        ? 'bg-gray-900/80 border-gray-800' 
        : 'bg-white/80 border-gray-200'
    } backdrop-blur-sm border-b shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Map className="w-8 h-8 text-primary" />
            <span className={`font-semibold text-lg ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Safari CRM</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="#features" className={`${
              isDarkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors font-medium`}>
              Features
            </Link>
            <Link to="#pricing" className={`${
              isDarkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors font-medium`}>
              Pricing
            </Link>
            <Link to="#about" className={`${
              isDarkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors font-medium`}>
              About
            </Link>
            <Link to="#contact" className={`${
              isDarkMode 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            } transition-colors font-medium`}>
              Contact
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors hidden md:block ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <Link
              to="/login"
              className={`hidden md:inline-flex transition-colors font-medium ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-black bg-primary hover:bg-primary/90 transition-colors shadow-sm"
            >
              Get Started
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden shadow-lg ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        } border-t`}>
          <div className="px-4 py-3 space-y-1">
            <Link
              to="#features"
              className={`block px-3 py-2 rounded-lg font-medium ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Features
            </Link>
            <Link
              to="#pricing"
              className={`block px-3 py-2 rounded-lg font-medium ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="#about"
              className={`block px-3 py-2 rounded-lg font-medium ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              About
            </Link>
            <Link
              to="#contact"
              className={`block px-3 py-2 rounded-lg font-medium ${
                isDarkMode 
                  ? 'text-gray-400 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}