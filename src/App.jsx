import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NewRaceForm from './components/NewRaceForm';
import NewTrackForm from './components/NewTrackForm';
import TrackDetail from './components/TrackDetail';
import Legend from './components/Legend';
import EditRaceForm from './components/EditRaceForm';
import TrackList from './components/TrackList';

// レース形式別の色設定
const raceFormatColors = {
  0: '#ff4d4d', // スプリント（赤）
  1: '#4da6ff', // 耐久（青）
  2: '#4CAF50', // MIX（緑）
  default: '#8c8c8c' // その他（グレー）
};

// レース形式に基づいて色を割り当てる関数
const getRaceFormatColor = (formatId) => {
  return raceFormatColors[formatId] || raceFormatColors.default;
};

// AppContent コンポーネントを作成して、useLocation を Router の中で使用
function AppContent() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const tooltipRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const location = useLocation(); // Router の中で使用

  // ウィンドウサイズの変更を検知
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://kart-race-api.onrender.com/schedules');
      setEvents(response.data.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startDate,
        end: event.endDate,
        backgroundColor: getRaceFormatColor(event.raceFormat),
        borderColor: 'transparent',
        textColor: 'white',
        extendedProps: {
          raceFormat: event.RaceFormat.name,
          raceFormatId: event.raceFormat,
          trackFullName: event.Track.fullName,
          trackShortName: event.Track.shortName,
          trackPrefecture: event.Track?.prefecture,
          raceUrl: event.raceUrl,
          trackId: event.Track.id,
        },
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

  // locationが変わったとき（ページ遷移時）にデータを再取得
  useEffect(() => {
    // ホーム画面に戻ってきたときだけ再取得
    if (location.pathname === '/') {
      fetchSchedules();
    }
  }, [location.pathname]);

  const showTooltip = (e, eventInfo) => {
    // ツールチップの内容を設定
    setTooltipContent({
      trackFullName: eventInfo.event.extendedProps.trackFullName,
      trackId: eventInfo.event.extendedProps.trackId,
      raceUrl: eventInfo.event.extendedProps.raceUrl,
      raceFormat: eventInfo.event.extendedProps.raceFormat,
      eventId: eventInfo.event.id,
    });

    // ツールチップの位置を調整
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY,
    });

    // ツールチップを表示
    setIsTooltipVisible(true);

    // 既存のタイマーをクリア
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const hideTooltip = () => {
    // ツールチップを非表示にするタイマーを設定
    hideTimeoutRef.current = setTimeout(() => {
      setIsTooltipVisible(false);
    }, 300); // 300ミリ秒の遅延を設定
  };

  const handleTooltipMouseEnter = () => {
    // ツールチップ内にマウスが入ったら、タイマーをクリア
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    // ツールチップからマウスが離れたら、ツールチップを非表示に
    setIsTooltipVisible(false);
  };

  // 年ごとにイベントをフィルタリングする関数
  const getEventsByYear = (year) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getFullYear() === year;
    });
  };

  // 年と月ごとにイベントをフィルタリングする関数
  const getEventsByYearAndMonth = (year, month) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    }).sort((a, b) => {
      // 日付でソート（昇順）
      return new Date(a.start) - new Date(b.start);
    });
  };

  // 年の選択肢を生成（現在年から3年後まで）
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 4; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  // 月の選択肢を生成
  const getMonthOptions = () => {
    return [
      { value: 0, label: '1月' },
      { value: 1, label: '2月' },
      { value: 2, label: '3月' },
      { value: 3, label: '4月' },
      { value: 4, label: '5月' },
      { value: 5, label: '6月' },
      { value: 6, label: '7月' },
      { value: 7, label: '8月' },
      { value: 8, label: '9月' },
      { value: 9, label: '10月' },
      { value: 10, label: '11月' },
      { value: 11, label: '12月' },
      { value: -1, label: '全ての月' }
    ];
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    
    return `${month}/${day}(${weekday})`;
  };

  // モバイル用のリスト表示
  const renderMobileView = () => {
    // 選択された年と月でイベントをフィルタリング
    const filteredEvents = selectedMonth === -1 
      ? getEventsByYear(selectedYear) 
      : getEventsByYearAndMonth(selectedYear, selectedMonth);
    
    return (
      <div className="mobile-calendar-view">
        <div className="date-selector">
          <div className="selector-group">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
              className="year-select"
            >
              {getYearOptions().map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
            
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
              className="month-select"
            >
              {getMonthOptions().map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredEvents.length > 0 ? (
          <div className="schedule-list">
            {filteredEvents.map(event => (
              <div key={event.id} className="schedule-item">
                <div className="schedule-date">
                  {formatDate(event.start)}
                </div>
                <div className="schedule-content">
                  <h4 className="schedule-title">{event.title}</h4>
                  <div className="schedule-details">
                    <span 
                      className="schedule-format" 
                      style={{ 
                        backgroundColor: event.backgroundColor
                      }}
                    >
                      {event.extendedProps.raceFormat}
                    </span>
                    
                    <div className="schedule-url">
                      <a 
                        href={`/schedules/${event.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        レース編集 <span className="link-arrow">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-schedule">
            <p>選択した期間のレース予定はありません。</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-image min-h-screen">
      <Header />
      <Routes>
        <Route path="/new-race" element={<NewRaceForm onClose={() => {}} />} />
        <Route path="/new-track" element={<NewTrackForm onClose={() => {}} />} />
        <Route path="/track/:trackId" element={<TrackDetail />} />
        <Route path="/schedules/:raceId" element={<EditRaceForm />} />
        <Route path="/tracks" element={<TrackList />} />
        <Route path="/" element={
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

                      {/* 凡例コンポーネントを使用 */}
                      <Legend raceFormatColors={raceFormatColors} />

                      {isMobile ? (
                        // モバイル用表示
                        renderMobileView()
                      ) : (
                        // PC用表示（既存のカレンダー）
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
                              onMouseEnter={(e) => showTooltip(e, eventInfo)}
                              onMouseLeave={hideTooltip}
                            >
                              <span className="px-2 truncate">
                                {eventInfo.event.extendedProps.trackShortName} - {eventInfo.event.title}
                              </span>
                            </div>
                          )}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        } />
      </Routes>

      {/* ツールチップ */}
      {isTooltipVisible && tooltipContent && (
        <div
          ref={tooltipRef}
          className="tooltip"
          style={{
            position: 'absolute',
            left: `${tooltipPosition.left}px`,
            top: `${tooltipPosition.top}px`,
            zIndex: 1000,
          }}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <strong>{tooltipContent.trackFullName}</strong><br />
          <a href={`/track/${tooltipContent.trackId}`} target="_blank">サーキット詳細</a><br />
          <a href={tooltipContent.raceUrl} target="_blank" style={!tooltipContent.raceUrl ? { pointerEvents: 'none', color: 'gray' } : {}}>レース詳細</a><br />
          <a href={`/schedules/${tooltipContent.eventId}`} target="_blank" className="text-blue-600 hover:text-blue-800">レース編集</a><br />
          <span>形式: {tooltipContent.raceFormat}</span><br />
          <span>{tooltipContent.raceUrl || 'レースURL: なし'}</span>
        </div>
      )}
    </div>
  );
}

// メインのAppコンポーネント
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;