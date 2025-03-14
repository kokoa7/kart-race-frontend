import React, { useEffect, useState } from 'react';
import './FormStyles.css';

function NewRaceForm({ onClose }) {
  const [tracks, setTracks] = useState([]); // コース名の状態を管理
  const [selectedTrack, setSelectedTrack] = useState(''); // 選択されたコース名
  const [raceName, setRaceName] = useState(''); // レース名
  const [referenceUrl, setReferenceUrl] = useState(''); // 参考URL
  const [raceDate, setRaceDate] = useState(''); // 日付
  const [raceFormat, setRaceFormat] = useState(0); // レース形式の状態を管理
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 新規スケジュール登録画面のタイトルとメタディスクリプションを設定
  useEffect(() => {
    document.title = "新規スケジュール登録 | エンジョイレンタルカートレース";
    
    // SEO対策：メタディスクリプションの設定
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'レンタルカートレースの新規スケジュールを登録するフォーム。サーキット選択、レース名、開催日などを入力できます。');
    }
  }, []);

  const raceFormats = [
    { id: 0, name: 'スプリント' },
    { id: 1, name: '耐久' },
    { id: 2, name: 'MIX' },
  ];

  useEffect(() => {
    // APIからコース名を取得
    fetch('https://kart-race-api.onrender.com/tracks')
      .then(response => {
        if (!response.ok) {
          throw new Error('サーキットデータの取得に失敗しました');
        }
        return response.json();
      })
      .then(data => {
        setTracks(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching tracks:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    // バリデーション
    if (!raceDate || !selectedTrack || !raceName) {
      alert('必須項目を入力してください');
      return;
    }

    setIsSubmitting(true);

    const raceData = {
      date: raceDate, // 日付
      trackId: selectedTrack, // 選択されたコース名のID
      raceName: raceName, // レース名
      raceFormat: raceFormat, // レース形式のID
      raceUrl: referenceUrl, // 参考URL
    };

    fetch('https://kart-race-api.onrender.com/schedules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(raceData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        alert('新規レース登録が完了しました');
        // アラートが閉じられた後にウィンドウを閉じる
        setTimeout(() => {
          window.close();
        }, 500);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('エラーが発生しました: ' + error.message);
        setIsSubmitting(false);
      });
  };

  if (isLoading) {
    return (
      <div className="form-page">
        <div className="form-container form-loading">
          <div className="spinner"></div>
          <p className="loading-text">サーキットデータを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-page">
        <div className="form-container form-error">
          <div className="error-icon">⚠️</div>
          <h2 className="error-title">エラーが発生しました</h2>
          <p className="error-message">{error}</p>
          <button onClick={() => window.close()} className="btn btn-error">閉じる</button>
        </div>
      </div>
    );
  }

  // 現在の日付を取得してデフォルト値に設定
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="form-page" role="main" aria-label="新規レース登録">
      {/* 見出しを追加（視覚的に非表示にしてSEO対策） */}
      <h1 className="visually-hidden">新規レース登録フォーム</h1>
      
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">新規レース登録</h2>
          <p className="form-subtitle">新しいレース情報を入力してください</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              開催日 <span className="required-mark">*</span>
            </label>
            <input 
              className="form-input"
              type="date" 
              value={raceDate} 
              onChange={(e) => setRaceDate(e.target.value)} 
              min={today}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">
              サーキット <span className="required-mark">*</span>
            </label>
            <select 
              className="form-select"
              value={selectedTrack} 
              onChange={(e) => setSelectedTrack(e.target.value)} 
              required
            >
              <option value="">選択してください</option>
              {tracks.map(track => (
                <option key={track.id} value={track.id}>
                  {track.shortName} - {track.fullName} ({track.prefecture})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              レース名 <span className="required-mark">*</span>
            </label>
            <input 
              className="form-input"
              type="text" 
              maxLength="30" 
              value={raceName} 
              onChange={(e) => setRaceName(e.target.value)} 
              required 
              placeholder="例: 第1回レンタルカートグランプリ"
            />
            <p className="form-hint">最大30文字まで入力できます</p>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              レース形式 <span className="required-mark">*</span>
            </label>
            <select 
              className="form-select"
              value={raceFormat} 
              onChange={(e) => setRaceFormat(Number(e.target.value))} 
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
            <label className="form-label">
              参考URL <span className="optional-mark">（任意）</span>
            </label>
            <input 
              className="form-input"
              type="url" 
              maxLength="100" 
              value={referenceUrl} 
              onChange={(e) => setReferenceUrl(e.target.value)} 
              placeholder="例: https://example.com/race-details"
            />
          </div>
          
          <div className="form-buttons">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '登録中...' : '登録する'}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => window.close()}
              disabled={isSubmitting}
            >
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewRaceForm; 