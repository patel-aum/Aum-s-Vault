import { Link, useNavigate } from 'react-router-dom';
import { Vault, CreditCard, Send, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { cn } from '../lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vault className="h-8 w-8" />
            <span className="text-xl font-bold">Aum's Vault</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              user?.role === 'admin' ? (
                <>
                  <Link to="/admin" className="hover:text-indigo-200">Admin</Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="hover:text-indigo-200">Dashboard</Link>
                  <Link to="/services" className="hover:text-indigo-200">Services</Link>
                  <Link to="/cards" className="flex items-center space-x-1 hover:text-indigo-200">
                    <CreditCard className="h-4 w-4" />
                    <span>Cards</span>
                  </Link>
                  <Link to="/transfer" className="flex items-center space-x-1 hover:text-indigo-200">
                    <Send className="h-4 w-4" />
                    <span>Transfer</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link to="/login" className="hover:text-indigo-200">Login</Link>
                <Link
                  to="/signup"
                  className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden",
            isOpen ? "block" : "hidden"
          )}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              user?.role === 'admin' ? (
                <>
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md hover:bg-indigo-500"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md hover:bg-indigo-500"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/services"
                    className="block px-3 py-2 rounded-md hover:bg-indigo-500"
                  >
                    Services
                  </Link>
                  <Link
                    to="/cards"
                    className="block px-3 py-2 rounded-md hover:bg-indigo-500"
                  >
                    Cards
                  </Link>
                  <Link
                    to="/transfer"
                    className="block px-3 py-2 rounded-md hover:bg-indigo-500"
                  >
                    Transfer
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-100"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md hover:bg-indigo-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md bg-white text-indigo-600 hover:bg-indigo-100"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
