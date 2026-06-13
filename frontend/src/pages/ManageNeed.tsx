import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Phone, Mail, CheckCircle, ArrowLeft, EyeOff, Trash2, Ban, Eye, Star } from 'lucide-react';
import ReviewModal from '../components/ReviewModal';

interface Application {
  id: string;
  volunteerId: string;
  options: string[];
  message: string;
  status: string;
  hasReviewed?: boolean;
  createdAt: string;
  volunteer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

const OPTION_LABELS: Record<string, string> = {
  'car': '🚗 Авто',
  'physical': '💪 Фіз. сила',
  'medical': '🏥 Медицина',
  'language': '🗣️ Мови',
};

export default function ManageNeed() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [reviewModalData, setReviewModalData] = useState<{ revieweeId: string, revieweeName: string } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [need, setNeed] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'ORGANIZER' && user.role !== 'ADMIN')) {
      navigate('/dashboard');
      return;
    }
    fetchData();
  }, [user, navigate, id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appRes, needRes] = await Promise.all([
        fetch(`/api/needs/${id}/applications`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/needs/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (appRes.ok) setApplications(await appRes.json());
      if (needRes.ok) setNeed(await needRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (appId: string) => {
    if (!window.confirm('Призначити цього волонтера?')) return;
    try {
      const res = await fetch(`/api/needs/applications/${appId}/accept`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (appId: string) => {
    if (!window.confirm('Ви впевнені, що хочете відхилити цю заявку?')) return;
    try {
      const res = await fetch(`/api/needs/applications/${appId}/reject`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    if (!window.confirm('Ви дійсно хочете видалити цей відгук назавжди?')) return;
    try {
      const res = await fetch(`/api/needs/applications/${appId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    try {
      const res = await fetch(`/api/needs/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert('Статус оновлено');
        if (status === 'CLOSED') navigate('/dashboard');
        else fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-rose-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Керування Заявкою</h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Дії з заявкою</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Ви можете приховати її з дошки або закрити.</p>
        </div>
        <div className="flex gap-3">
          {need?.status === 'HIDDEN' ? (
            <button 
              onClick={() => handleStatusUpdate('OPEN')}
              className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Eye size={18} /> Показати
            </button>
          ) : (
            <button 
              onClick={() => handleStatusUpdate('HIDDEN')}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <EyeOff size={18} /> Сховати
            </button>
          )}
          {need?.status !== 'CLOSED' && (
            <button 
              onClick={() => handleStatusUpdate('CLOSED')}
              className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Trash2 size={18} /> Закрити
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Відгуки Волонтерів ({applications.length})</h2>
        
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center text-gray-500 border border-gray-100 dark:border-gray-700">
            Ще ніхто не відгукнувся на цю заявку.
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{app.volunteer.name}</h3>
                  {app.status === 'ACCEPTED' && (
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <CheckCircle size={14} /> Призначено
                    </span>
                  )}
                  {app.status === 'REJECTED' && (
                    <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                      <Ban size={14} /> Відхилено
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {app.volunteer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Phone size={16} className="text-gray-400" /> {app.volunteer.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Mail size={16} className="text-gray-400" /> {app.volunteer.email}
                  </div>
                </div>

                {app.options.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {app.options.map(opt => (
                      <span key={opt} className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 text-xs px-2.5 py-1 rounded-md font-medium border border-rose-100 dark:border-rose-800/50">
                        {OPTION_LABELS[opt] || opt}
                      </span>
                    ))}
                  </div>
                )}
                
                {app.message && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 italic mt-3 border border-gray-100 dark:border-gray-700">
                    "{app.message}"
                  </div>
                )}
              </div>
              
              <div className="flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 pt-4 md:pt-0 md:pl-6 min-w-[140px] gap-2">
                {app.status === 'PENDING' && (
                  <>
                    <button 
                      onClick={() => handleAccept(app.id)}
                      className="w-full flex items-center justify-center gap-1.5 bg-rose-500 hover:bg-rose-600 active:scale-95 text-white font-medium px-4 py-2 rounded-lg transition-all shadow-sm"
                    >
                      <CheckCircle size={16} /> Прийняти
                    </button>
                    <button 
                      onClick={() => handleReject(app.id)}
                      className="w-full flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:hover:bg-orange-900/40 dark:text-orange-400 font-medium px-4 py-2 rounded-lg transition-colors border border-orange-200 dark:border-orange-800/50"
                    >
                      <Ban size={16} /> Відхилити
                    </button>
                  </>
                )}
                
                {(app.status === 'ACCEPTED' || app.status === 'REJECTED') && (
                  <span className="text-sm text-gray-500 mb-2 text-center">
                    {app.status === 'ACCEPTED' ? 'Прийнято' : 'Відхилено'} {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                )}

                {app.status === 'ACCEPTED' && need?.status === 'CLOSED' && (
                  app.hasReviewed ? (
                    <span className="w-full flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400 font-medium px-4 py-2 mt-auto">
                      <Star size={16} className="fill-current" /> Оцінено
                    </span>
                  ) : (
                    <button 
                      onClick={() => setReviewModalData({ revieweeId: app.volunteer.id, revieweeName: app.volunteer.name })}
                      className="w-full flex items-center justify-center gap-1.5 text-rose-500 border border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-medium px-4 py-2 rounded-lg transition-colors mt-auto mb-2"
                    >
                      <Star size={16} /> Оцінити
                    </button>
                  )
                )}
                
                {need?.status !== 'CLOSED' && (
                  <button 
                    onClick={() => handleDeleteApp(app.id)}
                    className="w-full flex items-center justify-center gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium px-4 py-2 rounded-lg transition-colors mt-auto"
                  >
                    <Trash2 size={16} /> Видалити
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {reviewModalData && id && (
        <ReviewModal
          needId={id}
          revieweeId={reviewModalData.revieweeId}
          revieweeName={reviewModalData.revieweeName}
          onClose={() => setReviewModalData(null)}
          onSuccess={() => {
            setReviewModalData(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
