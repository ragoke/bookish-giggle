import { Link } from 'react-router-dom';
import { ArrowRight, Users, HandHeart } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-16">
      <section className="text-center space-y-6 max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Об'єднуємо <span className="text-rose-500">волонтерів</span> та тих, хто потребує допомоги
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Проста та зручна платформа для створення заявок про допомогу та пошуку волонтерських завдань.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link to="/dashboard" className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md">
            Дошка заявок <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold transition-all hover:bg-gray-50 dark:hover:bg-gray-700">
            Реєстрація
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Для організацій</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Створюйте заявки, описуйте потреби та знаходьте вільні руки для реалізації ваших благодійних ініціатив.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center">
            <HandHeart className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">Для волонтерів</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Знаходьте актуальні запити у вашому місті або онлайн. Допомагайте там, де це найбільше потрібно.
          </p>
        </div>
      </section>
    </div>
  );
}
