import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import './App.css';
import Header from './components/Header';

// カテゴリ別の色設定
const categoryColors = {
  race: '#ff4d4d',      // レース（赤）
  practice: '#4da6ff',  // 練習（青）
  special: '#ffcc00',   // 特別イベント（黄色）
  default: '#8c8c8c'    // その他（グレー）
};

// カテゴリに基づいて色を割り当てる関数
const getEventColor = (category) => categoryColors[category] || categoryColors.default;

function App() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://kart-race-api.onrender.com/schedules');
      setEvents(response.data.map(event => ({
        ...event,
        backgroundColor: '#4da6ff',
        borderColor: 'transparent',
        textColor: 'white',
      })));
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setError(error.response ? `サーバーエラー: ${error.response.status}` : 'ネットワークエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="bg-image min-h-screen">
      <Header />
      <div className="py-8 px-4 pt-24">
        <div className="max-w-5xl mx-auto bg-transparent">
          <div className="bg-transparent">
            <div className="p-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-gray-600">読み込み中...</div>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 rounded-lg border border-red-300 text-red-700 text-center">
                      {error}
                      <button
                        onClick={fetchSchedules}
                        disabled={isLoading}
                        className="block mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        再試行
                      </button>
                    </div>
                  )}

                  <FullCalendar
                    plugins={[dayGridPlugin]}
                    events={events}
                    locale="ja"
                    height="auto"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: ''
                    }}
                    buttonText={{
                      today: '今日',
                      month: '月'
                    }}
                    dayCellClassNames="h-[200px] p-2 overflow-y-auto"
                    dayHeaderClassNames="py-2 text-gray-500 text-sm font-medium"
                    eventContent={(eventInfo) => (
                      <div
                        className="w-full h-full py-1 my-1 flex items-center rounded-md text-white text-xs cursor-pointer transition duration-200 ease-in-out"
                        style={{
                          backgroundColor: eventInfo.event.backgroundColor,
                          padding: '4px',
                          borderRadius: '6px',
                          textAlign: 'center',
                          display: 'block',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <span className="px-2 truncate">{eventInfo.event.title}</span>
                      </div>
                    )}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;