import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Key, Plus, Clock, Ban, Trash2, Users, FileText, ArrowRight } from 'lucide-react';

interface InviteCode {
  id: string;
  code: string;
  isUsed: boolean;
  createdAt: string;
  expiresAt: string;
  usedBy?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

interface Need {
  id: string;
  title: string;
  status: string;
  location: string;
  time: string;
  organizer: {
    name: string;
  };
}

function CountdownTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(expiresAt).getTime() - new Date().getTime();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (timeLeft <= 0) return null;

  const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  const isUrgent = timeLeft < 60000;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-medium border ${isUrgent ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50' : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
      <Clock className={`w-3 h-3 ${isUrgent ? 'animate-pulse' : ''}`} />
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </span>
  );
}

export default function AdminPanel() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'codes' | 'users' | 'needs'>('codes');
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/');
      return;
    }

    if (activeTab === 'codes') fetchCodes();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'needs') fetchNeeds();
  }, [user, navigate, activeTab]);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/invites', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setCodes(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchNeeds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/needs/all', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setNeeds(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/invites', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchCodes();
    } catch (err) { console.error(err); } finally { setGenerating(false); }
  };

  const handleRevoke = async (id: string) => {
    try {
      const res = await fetch(`/api/invites/${id}/revoke`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchCodes();
    } catch (err) { console.error(err); }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm('Видалити цей код назавжди?')) return;
    try {
      const res = await fetch(`/api/invites/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchCodes();
    } catch (err) { console.error(err); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Увага! Це повністю видалить користувача та всі його заявки/відгуки. Продовжити?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchUsers();
      else {
        const data = await res.json();
        alert(data.message || 'Помилка видалення');
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteNeed = async (id: string) => {
    if (!confirm('Видалити цю заявку?')) return;
    try {
      const res = await fetch(`/api/needs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) fetchNeeds();
      else {
        const data = await res.json();
        alert(data.message || 'Помилка видалення');
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-full text-rose-500">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Адмін Панель</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Керування платформою</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('codes')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'codes' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <Key className="w-4 h-4" /> Коди
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <Users className="w-4 h-4" /> Користувачі
        </button>
        <button
          onClick={() => setActiveTab('needs')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'needs' ? 'border-rose-500 text-rose-600 dark:text-rose-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
        >
          <FileText className="w-4 h-4" /> Заявки
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[400px]">
        {activeTab === 'codes' && (
          <div>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-gray-400" /> Інвайт-коди
              </h2>
              <button 
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm active:scale-95 disabled:opacity-70"
              >
                {generating ? <Clock className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Згенерувати
              </button>
            </div>
            
            {loading ? <div className="p-8 text-center text-gray-500">Завантаження...</div> : codes.length === 0 ? <div className="p-8 text-center text-gray-500">Кодів немає</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                      <th className="px-6 py-3 font-medium">Код</th>
                      <th className="px-6 py-3 font-medium">Статус</th>
                      <th className="px-6 py-3 font-medium text-right">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {codes.map((code) => {
                      const isExpired = new Date(code.expiresAt).getTime() < new Date().getTime();
                      const isActive = !code.isUsed && !isExpired;

                      return (
                        <tr key={code.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                              {code.code}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {code.isUsed ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                  Використано
                                </span>
                              ) : isExpired ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                                  Відхилено/Протерміновано
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                  Активний <CountdownTimer expiresAt={code.expiresAt} />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {isActive && (
                              <button onClick={() => handleRevoke(code.id)} className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Відкликати">
                                <Ban className="w-5 h-5" />
                              </button>
                            )}
                            <button onClick={() => handleDeleteCode(code.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Видалити">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" /> Користувачі
              </h2>
            </div>
            {loading ? <div className="p-8 text-center text-gray-500">Завантаження...</div> : users.length === 0 ? <div className="p-8 text-center text-gray-500">Немає користувачів</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                      <th className="px-6 py-3 font-medium">Ім'я</th>
                      <th className="px-6 py-3 font-medium">Контакти</th>
                      <th className="px-6 py-3 font-medium">Роль</th>
                      <th className="px-6 py-3 font-medium text-right">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{u.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div>{u.email}</div>
                          <div>{u.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'VOLUNTEER' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30'}`}>
                            {u.role === 'VOLUNTEER' ? 'Волонтер' : 'Організатор'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Видалити користувача">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'needs' && (
          <div>
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" /> Усі заявки
              </h2>
            </div>
            {loading ? <div className="p-8 text-center text-gray-500">Завантаження...</div> : needs.length === 0 ? <div className="p-8 text-center text-gray-500">Немає заявок</div> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
                      <th className="px-6 py-3 font-medium">Заявка</th>
                      <th className="px-6 py-3 font-medium">Організатор</th>
                      <th className="px-6 py-3 font-medium">Статус</th>
                      <th className="px-6 py-3 font-medium text-right">Дії</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {needs.map((need) => (
                      <tr key={need.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{need.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{need.location} • {need.time}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{need.organizer.name}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            need.status === 'OPEN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                            need.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 
                            need.status === 'CLOSED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {need.status === 'OPEN' ? 'АКТУАЛЬНО' : need.status === 'IN_PROGRESS' ? 'В ПРОЦЕСІ' : need.status === 'HIDDEN' ? 'ПРИХОВАНО' : need.status === 'CLOSED' ? 'ЗАКРИТО' : need.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                          <Link to={`/manage-need/${need.id}`} className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" title="Керувати">
                            <ArrowRight className="w-5 h-5" />
                          </Link>
                          <button onClick={() => handleDeleteNeed(need.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Видалити">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
