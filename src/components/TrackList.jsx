import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './TrackList.css';

const TrackList = () => {
  const [tracks, setTracks] = useState([]);
  const [selectedPrefecture, setSelectedPrefecture] = useState('all');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTracks = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://kart-race-api.onrender.com/tracks');
        setTracks(response.data);
      } catch (error) {
        setError('サーキット情報の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // 都道府県の一覧を取得（重複を除去）
  const prefectures = ['all', ...new Set(tracks.map(track => track.prefecture))];

  // 選択された都道府県でフィルタリングしたトラック一覧
  const filteredTracks = selectedPrefecture === 'all'
    ? tracks
    : tracks.filter(track => track.prefecture === selectedPrefecture);

  const handleTrackClick = (trackId) => {
    navigate(`/track/${trackId}`);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="track-list-container">
      <div className="track-list-content">
        <div className="track-list-header">
          <div className="title-container">
            <h1>Circuit List</h1>
            <span className="title-accent">レンタルカートサーキット</span>
          </div>
          <div className="prefecture-selector">
            <select 
              value={selectedPrefecture}
              onChange={(e) => setSelectedPrefecture(e.target.value)}
              className="prefecture-select"
            >
              <option value="all">全ての都道府県</option>
              {prefectures
                .filter(pref => pref !== 'all')
                .sort()
                .map(prefecture => (
                  <option key={prefecture} value={prefecture}>
                    {prefecture}
                  </option>
                ))
              }
            </select>
          </div>
        </div>

        <div className="tracks-grid">
          {filteredTracks.map(track => (
            <div
              key={track.id}
              className="track-card"
              onClick={() => handleTrackClick(track.id)}
            >
              <h3 className="track-name">{track.fullName}</h3>
              <p className="track-prefecture">{track.prefecture}</p>
              <span className="track-shortname">{track.shortName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackList; 