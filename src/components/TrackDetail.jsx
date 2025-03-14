import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './TrackDetail.css'; // CSSファイルをインポート

const TrackDetail = () => {
  const { trackId } = useParams(); // URLからトラックIDを取得
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // トラック情報とスケジュール情報を並行して取得
        const [trackResponse, schedulesResponse] = await Promise.all([
          axios.get(`https://kart-race-api.onrender.com/tracks/${trackId}`),
          axios.get(`https://kart-race-api.onrender.com/schedules/track/${trackId}`)
        ]);
        
        setTrack(trackResponse.data);
        setSchedules(schedulesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`データの取得に失敗しました。エラー: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [trackId]);

  // 年の一覧を取得
  const years = [...new Set(schedules.map(schedule => 
    new Date(schedule.startDate).getFullYear()
  ))].sort((a, b) => b - a); // 降順でソート

  // 選択された年のスケジュールをフィルタリング
  const filteredSchedules = schedules.filter(schedule => 
    new Date(schedule.startDate).getFullYear() === selectedYear
  );

  // レース形式に基づいて色を返す関数
  const getRaceFormatColor = (formatId) => {
    const colors = {
      0: '#ff4d4d', // スプリント（赤）
      1: '#4da6ff', // 耐久（青）
      2: '#4CAF50', // MIX（緑）
      default: '#8c8c8c' // その他（グレー）
    };
    return colors[formatId] || colors.default;
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(date);
  };

  // 閉じるボタンのハンドラーを修正
  const handleClose = () => {
    navigate(-1); // 前のページに戻る
  };

  // レーススケジュールセクションの内容を更新
  const renderScheduleSection = () => (
    <div className="card-section">
      <h3 className="section-title">開催レース</h3>
      <div className="schedule-header">
        <div className="year-selector">
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="year-select"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredSchedules.length > 0 ? (
        <div className="schedule-list">
          {filteredSchedules.map(schedule => (
            <div key={schedule.id} className="schedule-item">
              <div className="schedule-date">
                {formatDate(schedule.startDate)}
              </div>
              <div className="schedule-content">
                <h4 className="schedule-title">{schedule.title}</h4>
                <div className="schedule-details">
                  <span 
                    className="schedule-format" 
                    style={{ 
                      backgroundColor: getRaceFormatColor(schedule.raceFormat)
                    }}
                  >
                    {schedule.RaceFormat?.name || 
                     (schedule.raceFormat === 0 ? 'スプリント' : 
                      schedule.raceFormat === 1 ? '耐久' : 'MIX')}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  marginTop: '8px' 
                }}>
                  <a 
                    href={`/edit-race/${schedule.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: '#4da6ff',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      display: 'inline-flex',
                      alignItems: 'center',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a8ad6'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4da6ff'}
                  >
                    編集
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-schedule">
          <p>選択した年のレース予定はありません。</p>
        </div>
      )}
    </div>
  );

  // サーキット詳細画面のタイトルとメタディスクリプションを設定
  useEffect(() => {
    const title = track 
      ? `${track.fullName} | サーキット詳細 | エンジョイレンタルカートレース` 
      : 'サーキット詳細 | エンジョイレンタルカートレース';
    document.title = title;
    
    // SEO対策：メタディスクリプションの設定
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && track) {
      metaDescription.setAttribute('content', `${track.fullName}（${track.prefecture}）のサーキット情報と開催レース一覧。レンタルカートレースのスケジュールを確認できます。`);
    }
  }, [track]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <div className="loading-text">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">!</div>
          <div className="error-message">
            <strong>エラー</strong>
            <p>{error}</p>
          </div>
          <button 
            onClick={handleClose}
            className="error-button"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="empty-container">
        <div className="empty-content">
          <div className="empty-icon">?</div>
          <div className="empty-text">トラック情報がありません</div>
          <button 
            onClick={handleClose}
            className="primary-button"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="track-detail-container" role="main" aria-label="サーキット詳細">
      <div className="track-detail-header">
        <div className="header-content">
          <h1 className="track-title">{track.fullName}</h1>
          <h2 className="track-subtitle">{track.shortName} - {track.prefecture}</h2>
        </div>
        <button 
          onClick={handleClose}
          className="close-button"
          aria-label="閉じる"
        >
          <span>✕</span>
        </button>
      </div>

      <div className="track-detail-content">
        <div className="track-detail-card">
          <div className="card-section" role="region" aria-label="サーキット情報">
            <h2 className="section-title">
              <span className="section-icon">ℹ️</span>
              サーキット情報
            </h2>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">サーキット名</div>
                <div className="info-value">{track.fullName}</div>
              </div>
              <div className="info-item">
                <div className="info-label">略称</div>
                <div className="info-value">{track.shortName}</div>
              </div>
              <div className="info-item">
                <div className="info-label">都道府県</div>
                <div className="info-value">{track.prefecture}</div>
              </div>
              <div className="info-item">
                <div className="info-label">ウェブサイト</div>
                <div className="info-value">
                  {track.homepageUrl ? (
                    <a 
                      href={track.homepageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="track-link"
                    >
                      {track.homepageUrl} <span className="link-arrow">→</span>
                    </a>
                  ) : '情報なし'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-section" role="region" aria-label="開催レース">
            <h2 className="section-title">開催レース</h2>
            {renderScheduleSection()}
          </div>
          
          <div className="card-section" role="region" aria-label="地図">
            <h2 className="section-title">
              <span className="section-icon">🗺️</span>
              地図
            </h2>
            <div className="map-container">
              {track.fullName && (
                <iframe
                  title="Google Map"
                  className="map-iframe"
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(track.fullName)}`}
                ></iframe>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackDetail; 