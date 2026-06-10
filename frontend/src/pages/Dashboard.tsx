import { MapPin, Clock, ArrowRight } from 'lucide-react';

const MOCK_NEEDS = [
  {
    id: '1',
    title: 'Допомога з розвезенням продуктів для літніх людей',
    organizer: 'БФ "Турбота"',
    status: 'OPEN',
    location: 'Київ',
    time: 'Сьогодні, 14:00',
  },
  {
    id: '2',
    title: 'Потрібні руки для сортування гуманітарної допомоги',
    organizer: 'Волонтерський Штаб',
    status: 'OPEN',
    location: 'Львів',
    time: 'Завтра, 10:00',
  },
  {
    id: '3',
    title: 'Допомога в притулку для тварин',
    organizer: 'Happy Paw',
    status: 'OPEN',
    location: 'Одеса',
    time: 'На вихідних',
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Дошка заявок</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Знайдіть завдання, де ваша допомога буде найкориснішою</p>
        </div>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm self-start sm:self-auto">
          + Створити заявку
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_NEEDS.map((need) => (
          <div key={need.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="mb-4 flex-1">
              <span className="inline-block px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold rounded-full mb-3">
                АКТУАЛЬНО
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
                {need.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{need.organizer}</p>
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
            
            <button className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 py-2.5 rounded-lg font-medium transition-colors mt-auto">
              Відгукнутись <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
