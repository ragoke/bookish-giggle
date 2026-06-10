export default function Login() {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">З поверненням!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Увійдіть до свого облікового запису</p>
      </div>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input 
            type="email" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Пароль</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
        <button 
          type="button" 
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          Увійти
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Ще не маєте акаунту? <a href="#" className="text-rose-500 font-medium hover:underline">Зареєструватись</a>
      </div>
    </div>
  );
}
