import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, User, Mail, Lock, Building, Phone, Key } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [role, setRole] = useState<'VOLUNTEER' | 'ORGANIZER'>('VOLUNTEER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (role === 'VOLUNTEER' && !phone) {
      setError('Будь ласка, вкажіть ваш номер телефону');
      return;
    }
    
    if (role === 'ORGANIZER' && !inviteCode) {
      setError('Для реєстрації Організатора потрібен код-запрошення');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          role,
          ...(role === 'VOLUNTEER' ? { phone } : {}),
          ...(role === 'ORGANIZER' ? { inviteCode } : {})
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Помилка реєстрації');
      }
      
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mt-12 transition-all hover:shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Приєднуйтесь!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Створіть новий обліковий запис</p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ім'я або Назва</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              placeholder="Іван Франко"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Пароль</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Хто ви?</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole('VOLUNTEER')}
              className={`py-3 px-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                role === 'VOLUNTEER' 
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <User className="mb-1" size={24} />
              <span className="text-sm font-medium">Волонтер</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('ORGANIZER')}
              className={`py-3 px-4 rounded-lg border flex flex-col items-center justify-center transition-all ${
                role === 'ORGANIZER' 
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 ring-1 ring-rose-500' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              <Building className="mb-1" size={24} />
              <span className="text-sm font-medium">Організатор</span>
            </button>
          </div>
        </div>

        {role === 'VOLUNTEER' && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Номер телефону</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone size={18} />
              </div>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={role === 'VOLUNTEER'}
                autoComplete="tel"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                placeholder="+380 99 123 45 67"
              />
            </div>
          </div>
        )}

        {role === 'ORGANIZER' && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Код-запрошення</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Key size={18} />
              </div>
              <input 
                type="text" 
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                required={role === 'ORGANIZER'}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all uppercase"
                placeholder="Введіть код"
              />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full flex items-center justify-center bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-bold py-3 px-4 rounded-lg mt-6 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Створити акаунт'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Вже маєте акаунт? <Link to="/login" className="text-rose-500 font-medium hover:underline ml-1">Увійти</Link>
      </div>
    </div>
  );
}
