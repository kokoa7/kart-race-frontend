import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';

function App() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://kart-race-api.onrender.com/schedules');
      setEvents(response.data);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            レーススケジュール
          </h1>
          
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
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-red-600 text-center mb-3">{error}</p>
                  <div className="text-center">
                    <button
                      onClick={fetchSchedules}
                      disabled={isLoading}
                      className={`
                        px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 
                        text-white rounded-full font-medium shadow-lg 
                        hover:shadow-blue-500/30 transition-all duration-200
                        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:translate-y-[-1px]'}
                      `}
                    >
                      {isLoading ? '読み込み中...' : '再試行'}
                    </button>
                  </div>
                </div>
              )}
              
              <div className="rounded-xl overflow-hidden shadow-lg px-8 md:px-16">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={events}
                  locale="ja"
                  height="700px"
                  headerToolbar={{
                    left: '',  // 左側を空に
                    center: 'title prev,next today',  // titleを先に、その後にprev,next,todayを横並びで配置
                    right: ''  // 右側を空に
                  }}
                  buttonText={{
                    today: '今日',
                    month: '月'
                  }}
                  eventContent={(eventInfo) => (
                    <div className="p-2 rounded-lg transition-all duration-200 hover:scale-[1.02]">
                      <div className="font-bold">{eventInfo.event.title}</div>
                      {eventInfo.event.extendedProps?.description && (
                        <div className="text-sm opacity-90 mt-1">
                          {eventInfo.event.extendedProps.description}
                        </div>
                      )}
                    </div>
                  )}
                  eventBackgroundColor="#4f46e5"
                  eventBorderColor="#4338ca"
                  eventTextColor="#ffffff"
                  dayCellClassNames="hover:bg-indigo-50 transition-colors"
                  eventClassNames="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;