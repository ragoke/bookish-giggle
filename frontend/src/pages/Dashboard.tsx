import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Loader2, X, Check, CheckCircle, Ban } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Need {
  id: string;
  title: string;
  description: string;
  status: string;
  location: string;
  time: string;
  organizerId: string;
  organizer: {
    name: string;
  };
}

const VOLUNTEER_OPTIONS = [
  { id: 'car', label: '🚗 Маю авто' },
  { id: 'physical', label: '💪 Фізична сила' },
  { id: 'medical', label: '🏥 Медичні навички' },
  { id: 'language', label: '🗣️ Знання іноземних мов' },
];

export default function Dashboard() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [myApps, setMyApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<Need | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'В ПРОЦЕСІ';
      case 'HIDDEN': return 'ПРИХОВАНО';
      case 'CLOSED': return 'ЗАКРИТО';
      default: return 'АКТУАЛЬНО';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'HIDDEN': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'CLOSED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    }
  };
  
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch('/api/needs').then(res => res.json()),
      user?.role === 'ORGANIZER' && token 
        ? fetch('/api/needs/my-needs', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()) 
        : Promise.resolve([])
    ])
    .then(([publicNeeds, myNeeds]) => {
      // Фільтруємо публічні (щоб сховати приховані), але мої заявки залишаємо як є
      const filteredPublic = publicNeeds.filter((n: Need) => n.status !== 'HIDDEN' && n.status !== 'CLOSED');
      
      const map = new Map();
      filteredPublic.forEach((n: Need) => map.set(n.id, n));
      // Мої заявки (навіть приховані чи закриті) перепишуть публічні або додадуться
      if (Array.isArray(myNeeds)) {
        myNeeds.forEach((n: Need) => map.set(n.id, n));
      }
      
      const merged = Array.from(map.values()).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNeeds(merged);
      setLoading(false);
    })
    .catch(err => {
      console.error('Failed to fetch needs:', err);
      setLoading(false);
    });
      
    if (user?.role === 'VOLUNTEER' && token) {
      fetch('/api/needs/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setMyApps(data))
      .catch(err => console.error('Failed to fetch my apps:', err));
    }
  }, [user, token]);

  const handleApplyClick = (need: Need) => {
    if (!user) {
      alert('Будь ласка, увійдіть в акаунт, щоб відгукнутись.');
      navigate('/login');
      return;
    }
    if (user.role === 'ORGANIZER') {
      alert('Організатори не можуть відгукуватись на заявки.');
      return;
    }
    setApplyingTo(need);
    setOptions([]);
    setMessage('');
  };

  const submitApplication = async () => {
    if (!applyingTo || !token) return;
    setApplyLoading(true);
    try {
      const res = await fetch(`/api/needs/${applyingTo.id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ options, message })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Помилка');
      
      alert('Ви успішно відгукнулись!');
      setApplyingTo(null);
      
      // Оновлюємо список моїх заявок
      if (token) {
        fetch('/api/needs/my-applications', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(r => r.json())
        .then(data => setMyApps(data));
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApplyLoading(false);
    }
  };

  const toggleOption = (id: string) => {
    setOptions(prev => prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Дошка заявок</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Знайдіть завдання, де ваша допомога буде найкориснішою</p>
        </div>
        
        {user?.role === 'ORGANIZER' && (
          <Link 
            to="/create-need" 
            className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm hover:shadow-md active:scale-95 self-start sm:self-auto text-center"
          >
            + Створити заявку
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((need) => (
            <div key={need.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="mb-4 flex-1">
                <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full mb-3 ${getStatusColor(need.status)}`}>
                  {getStatusLabel(need.status)}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
                  {need.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{need.organizer.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-3">{need.description}</p>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {need.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  {need.time}
                </div>
              </div>
              
              {user?.role === 'ORGANIZER' && need.organizerId === ((user as any)?.userId || (user as any)?.sub) ? (
                <Link 
                  to={`/manage-need/${need.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-lg font-medium transition-colors mt-auto"
                >
                  Керувати заявкою <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (() => {
                const app = myApps.find(a => a.needId === need.id);
                if (app) {
                  return (
                    <div className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium mt-auto border ${
                      app.status === 'ACCEPTED' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50' : 
                      app.status === 'REJECTED' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50' :
                      'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}>
                      {app.status === 'ACCEPTED' && <><CheckCircle className="w-4 h-4" /> Призначено</>}
                      {app.status === 'REJECTED' && <><Ban className="w-4 h-4" /> Відхилено</>}
                      {app.status === 'PENDING' && <><Clock className="w-4 h-4" /> Очікує відповіді</>}
                    </div>
                  );
                }
                return (
                  <button 
                    onClick={() => handleApplyClick(need)}
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 py-2.5 rounded-lg font-medium transition-colors mt-auto"
                  >
                    Відгукнутись <ArrowRight className="w-4 h-4" />
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {applyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Відгук на заявку</h2>
              <button onClick={() => setApplyingTo(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Оберіть те, що стосується вас (опціонально):</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VOLUNTEER_OPTIONS.map(opt => {
                    const selected = options.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleOption(opt.id)}
                        className={`flex items-center justify-between px-3 py-2 border rounded-lg text-sm text-left transition-all ${selected ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}`}
                      >
                        {opt.label}
                        {selected && <Check className="w-4 h-4" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Коментар для організатора</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Наприклад: Буду о 14:00, маю великий багажник..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all min-h-[100px] resize-y"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
              <button 
                onClick={() => setApplyingTo(null)}
                className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Скасувати
              </button>
              <button 
                onClick={submitApplication}
                disabled={applyLoading}
                className="flex items-center justify-center min-w-[120px] bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-70 disabled:scale-100"
              >
                {applyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Відправити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
