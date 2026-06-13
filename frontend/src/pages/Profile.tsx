import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, Save, Key, User as UserIcon, Loader2, Activity, Star, MessageSquare } from 'lucide-react';
import ReviewModal from '../components/ReviewModal';

export default function Profile() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [reviewsData, setReviewsData] = useState<{ avgRating: number, totalReviews: number, reviews: any[] } | null>(null);

  const [formData, setFormData] = useState({ name: '', phone: '', bio: '' });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  
  const [reviewModalData, setReviewModalData] = useState<{ needId: string, revieweeId: string, revieweeName: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchHistory();
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users/me', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setProfile(data);
      setFormData({ name: data.name || '', phone: data.phone || '', bio: data.bio || '' });

      // Fetch reviews
      if (data.id) {
        const reviewsRes = await fetch(`/api/reviews/user/${data.id}`, { headers: { Authorization: `Bearer ${token}` } });
        const reviewsJson = await reviewsRes.json();
        setReviewsData(reviewsJson);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const endpoint = user?.role === 'VOLUNTEER' ? '/api/needs/my-applications' : '/api/needs/my-needs';
      const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Помилка оновлення');
      alert('Профіль оновлено!');
      fetchProfile();
    } catch (e) {
      alert('Не вдалося оновити профіль');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) return;
    
    try {
      const res = await fetch('/api/users/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Помилка');
      }
      alert('Пароль успішно змінено!');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/users/me/avatar', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Помилка завантаження');
      alert('Аватарку оновлено!');
      fetchProfile();
    } catch (e) {
      alert('Не вдалося завантажити аватарку');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-md">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon className="w-10 h-10" />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.name}</h1>
                {reviewsData && reviewsData.totalReviews > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-sm font-bold">
                    <Star size={14} className="fill-current" /> {reviewsData.avgRating}
                  </div>
                )}
              </div>
              <p className="text-gray-500 dark:text-gray-400">{profile?.email}</p>
              <span className="inline-block mt-2 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                {profile?.role === 'VOLUNTEER' ? 'Волонтер' : 'Організатор'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-gray-400" /> Основна інформація
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ім'я / Назва</label>
              <input 
                type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Телефон</label>
              <input 
                type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Про себе / Опис</label>
              <textarea 
                value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <button disabled={saving} type="submit" className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-70">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Зберегти зміни
            </button>
          </form>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-gray-400" /> Зміна паролю
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Старий пароль</label>
              <input 
                type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Новий пароль</label>
              <input 
                type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <button type="submit" className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Змінити пароль
            </button>
          </form>
        </div>
      </div>

      {reviewsData && reviewsData.reviews.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-rose-500" /> Відгуки про мене ({reviewsData.totalReviews})
          </h3>
          <div className="space-y-4">
            {reviewsData.reviews.map(review => (
              <div key={review.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {review.reviewer.avatarUrl ? (
                        <img src={review.reviewer.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="w-full h-full p-1 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{review.reviewer.name}</div>
                      <div className="text-xs text-gray-500">Заявка: {review.need.title}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden p-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Activity className="w-6 h-6 text-rose-500" /> Історія активності
        </h3>
        
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Поки що немає записів у історії.</p>
        ) : (
          <div className="space-y-4">
            {history.map(item => {
              const title = user?.role === 'VOLUNTEER' ? item.need?.title : item.title;
              const status = user?.role === 'VOLUNTEER' ? item.status : item.status;
              const needStatus = user?.role === 'VOLUNTEER' ? item.need?.status : item.status;
              
              const canReview = user?.role === 'VOLUNTEER' && status === 'ACCEPTED' && needStatus === 'CLOSED' && !item.hasReviewed;
              const hasReviewed = user?.role === 'VOLUNTEER' && item.hasReviewed;

              return (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
                    <p className="text-sm text-gray-500 mt-1">Оновлено: {new Date(item.updatedAt || item.createdAt).toLocaleDateString('uk-UA')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      status === 'ACCEPTED' || status === 'OPEN' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      status === 'PENDING' || status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      status === 'REJECTED' || status === 'CLOSED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {status}
                    </span>
                    
                    {canReview && (
                      <button 
                        onClick={() => setReviewModalData({ needId: item.need.id, revieweeId: item.need.organizer.id, revieweeName: item.need.organizer.name })}
                        className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors font-medium"
                      >
                        <Star size={14} /> Оцінити
                      </button>
                    )}
                    {hasReviewed && (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                        <Star size={14} className="fill-current" /> Оцінено
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {reviewModalData && (
        <ReviewModal
          needId={reviewModalData.needId}
          revieweeId={reviewModalData.revieweeId}
          revieweeName={reviewModalData.revieweeName}
          onClose={() => setReviewModalData(null)}
          onSuccess={() => {
            setReviewModalData(null);
            fetchHistory();
          }}
        />
      )}
    </div>
  );
}
