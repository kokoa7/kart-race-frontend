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
      setError('スケジュールの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">レーススケジュール</h1>
      {error && (
        <div className="text-center mb-4">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchSchedules}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            再試行
          </button>
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        locale="ja"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth'
        }}
        buttonText={{
          today: '今日',
          month: '月'
        }}
        eventContent={(eventInfo) => (
          <div className="p-1">
            <div className="font-bold">{eventInfo.event.title}</div>
            <div className="text-sm">{eventInfo.event.extendedProps.description}</div>
          </div>
        )}
      />
    </div>
  );
}

export default App;