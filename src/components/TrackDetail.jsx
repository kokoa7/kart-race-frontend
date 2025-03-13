import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './TrackDetail.css'; // CSSファイルをインポート

const TrackDetail = () => {
  const { trackId } = useParams(); // URLからトラックIDを取得
  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrackDetails = async () => {
      setIsLoading(true);
      try {
        console.log(`トラック情報を取得中: https://kart-race-api.onrender.com/tracks/${trackId}`);
        const response = await axios.get(`https://kart-race-api.onrender.com/tracks/${trackId}`);
        console.log('取得したトラック情報:', response.data);
        setTrack(response.data);
      } catch (error) {
        console.error('Error fetching track details:', error);
        setError(`トラック情報の取得に失敗しました。エラー: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackDetails();
  }, [trackId]);

  // 閉じるボタンのハンドラー
  const handleClose = () => {
    window.close(); // 現在のウィンドウを閉じる
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div>
          <div className="spinner"></div>
          <div className="loading-text">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <strong>エラー:</strong>
          <span> {error}</span>
        </div>
        <button 
          onClick={handleClose}
          className="error-button"
        >
          閉じる
        </button>
      </div>
    );
  }

  if (!track) {
    return (
      <div className="loading-container">
        <div className="loading-text">トラック情報がありません</div>
      </div>
    );
  }

  return (
    <div className="track-detail-container">
      <div className="track-detail-content">
        <div className="track-detail-card">
          <div className="track-detail-inner">
            <button 
              onClick={handleClose}
              className="close-button"
            >
              ✕ 閉じる
            </button>
            
            <h1 className="track-title">{track.fullName}</h1>
            <h2 className="track-subtitle">{track.shortName} - {track.prefecture}</h2>
            
            <div className="track-info">
              <h3 className="section-title">サーキット情報</h3>
              <p>
                <span className="info-label">ウェブサイト: </span>
                {track.homepageUrl ? (
                  <a 
                    href={track.homepageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="track-link"
                  >
                    {track.homepageUrl}
                  </a>
                ) : '情報なし'}
              </p>
            </div>
            
            <div className="map-container">
              <h3 className="section-title">地図</h3>
              <div>
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
    </div>
  );
};

export default TrackDetail; 