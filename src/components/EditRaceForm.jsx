import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditRaceForm.css';

function EditRaceForm() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    trackId: '',
    originalTrackId: '',
    raceFormat: 0,
    raceUrl: ''
  });
  const [tracks, setTracks] = useState([]);
  const [raceFormats, setRaceFormats] = useState([
    { id: 0, name: 'スプリント' },
    { id: 1, name: '耐久' },
    { id: 2, name: 'MIX' }
  ]);

  // レースデータの取得
  useEffect(() => {
    const fetchRaceData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`https://kart-race-api.onrender.com/schedules/${raceId}`);
        const raceData = response.data;
        
        console.log('Fetched race data:', JSON.stringify(raceData, null, 2));
        
        // 日付のみのフォーマットに変換（YYYY-MM-DD形式に）
        const startDate = new Date(raceData.startDate);
        
        // APIレスポンスの構造に基づいてフォームデータを設定
        setFormData({
          title: raceData.title,
          date: formatDateForInput(startDate),
          trackId: raceData.TrackId, // TrackIdをそのまま使用
          originalTrackId: raceData.TrackId, // 元のTrackIdも保存
          raceFormat: raceData.raceFormat.toString(),
          raceUrl: raceData.raceUrl || ''
        });
        
        // トラック一覧も取得
        const tracksResponse = await axios.get('https://kart-race-api.onrender.com/tracks');
        setTracks(tracksResponse.data);
        
      } catch (err) {
        console.error('Error fetching race data:', err);
        setError('レースデータの取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRaceData();
  }, [raceId]);

  // 日付をinput[type="date"]用にフォーマット
  const formatDateForInput = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'raceFormat' || name === 'trackId' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      // trackIdがnullまたは空の場合、元のTrackIdを使用
      const trackIdToUse = formData.trackId || formData.originalTrackId;
      
      // APIが期待する形式にデータを変換
      const apiData = {
        date: formData.date,
        trackId: parseInt(trackIdToUse, 10),
        raceName: formData.title,
        raceFormat: formData.raceFormat,
        raceUrl: formData.raceUrl || null
      };
      
      console.log('Sending data to API:', JSON.stringify(apiData, null, 2));
      
      const response = await axios.put(`https://kart-race-api.onrender.com/schedules/${raceId}`, apiData);
      console.log('API response:', response.data);
      
      alert('レース情報が更新されました');
      navigate('/');
    } catch (err) {
      console.error('Error updating race:', err);
      
      // エラーの詳細情報を表示
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(`レース情報の更新に失敗しました。エラー: ${JSON.stringify(err.response.data)}`);
      } else {
        setError('レース情報の更新に失敗しました。ネットワークエラーが発生しました。');
      }
      
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('このレースを削除してもよろしいですか？')) {
      try {
        setIsLoading(true);
        await axios.delete(`https://kart-race-api.onrender.com/schedules/${raceId}`);
        alert('レースが削除されました');
        navigate('/');
      } catch (err) {
        console.error('Error deleting race:', err);
        setError('レースの削除に失敗しました。');
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div className="loading-text">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-race-container">
      <div className="edit-race-form-wrapper">
        <h2 className="edit-race-title">レース編集</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              レースタイトル
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="date">
              開催日
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="trackId">
              サーキット
            </label>
            <select
              id="trackId"
              name="trackId"
              value={formData.trackId}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">選択してください</option>
              {tracks.map(track => (
                <option key={track.id} value={track.id}>
                  {track.fullName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="raceFormat">
              レース形式
            </label>
            <select
              id="raceFormat"
              name="raceFormat"
              value={formData.raceFormat}
              onChange={handleChange}
              className="form-input"
              required
            >
              {raceFormats.map(format => (
                <option key={format.id} value={format.id}>
                  {format.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="raceUrl">
              レースURL（オプション）
            </label>
            <input
              type="url"
              id="raceUrl"
              name="raceUrl"
              value={formData.raceUrl}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          
          <div className="button-group">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              更新
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={isLoading}
            >
              削除
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              disabled={isLoading}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRaceForm; 