import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="font-bold text-xl tracking-tight">HelpUkraine</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium transition-colors">Заявки</Link>
              
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors">Адмін-панель</Link>
              )}

              {isAuthenticated ? (
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                  <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 mr-1.5" />
                    {user?.email}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Вийти</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-rose-500 hover:bg-rose-600 active:scale-95 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow">Увійти</Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Платформа для волонтерів. Університетська практика.
        </div>
      </footer>
    </div>
  );
}
