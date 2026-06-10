import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="font-bold text-xl tracking-tight">HelpUkraine</span>
            </Link>
            <nav className="flex space-x-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium">Заявки</Link>
              <Link to="/login" className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-md font-medium transition-colors">Увійти</Link>
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
