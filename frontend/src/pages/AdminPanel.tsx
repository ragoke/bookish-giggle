import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Plus, CheckCircle, Clock } from 'lucide-react';

interface InviteCode {
  id: string;
  code: string;
  isUsed: boolean;
  createdAt: string;
  usedBy?: string;
}

export default function AdminPanel() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    fetchCodes();
  }, [user, navigate]);

  const fetchCodes = async () => {
    try {
      const res = await fetch('/api/invites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCodes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/invites', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCodes();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-full text-rose-500">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Адмін Панель</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Керування кодами доступу для Організаторів</p>
          </div>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95 disabled:opacity-70"
        >
          {generating ? <Clock className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Згенерувати код
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-2">
          <Key className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Згенеровані коди</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Завантаження...</div>
        ) : codes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Жодного коду ще не згенеровано.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                  <th className="px-6 py-3 font-medium">Код</th>
                  <th className="px-6 py-3 font-medium">Статус</th>
                  <th className="px-6 py-3 font-medium">Дата створення</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {codes.map((invite) => (
                  <tr key={invite.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-900 rounded text-rose-600 dark:text-rose-400 font-mono font-bold tracking-wider">
                        {invite.code}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      {invite.isUsed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          <CheckCircle className="w-3.5 h-3.5" /> Використано
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          <Clock className="w-3.5 h-3.5" /> Активний
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invite.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
