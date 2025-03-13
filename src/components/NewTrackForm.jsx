import React, { useEffect, useState } from 'react';
import './FormStyles.css';

function NewTrackForm({ onClose }) {
  const [fullName, setFullName] = useState('');
  const [shortName, setShortName] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [homepageUrl, setHomepageUrl] = useState('');
  const [prefectures, setPrefectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 都道府県一覧を取得
    fetch('https://kart-race-api.onrender.com/prefectures')
      .then(response => {
        if (!response.ok) {
          throw new Error('都道府県データの取得に失敗しました');
        }
        return response.json();
      })
      .then(data => {
        setPrefectures(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching prefectures:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const validateShortName = (value) => {
    // 英字大文字3文字以下のみ許可
    const regex = /^[A-Z]{1,3}$/;
    return regex.test(value);
  };

  const handleShortNameChange = (e) => {
    const value = e.target.value.toUpperCase();
    if (value === '' || validateShortName(value)) {
      setShortName(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // バリデーション
    if (!fullName || !shortName || !prefecture) {
      alert('必須項目を入力してください');
      return;
    }

    if (!validateShortName(shortName)) {
      alert('サーキット略称は英字大文字3文字以下で入力してください');
      return;
    }

    setIsSubmitting(true);

    const trackData = {
      fullName,
      shortName,
      prefecture,
      homepageUrl: homepageUrl || null
    };

    fetch('https://kart-race-api.onrender.com/tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('サーバーエラーが発生しました');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        alert('新規サーキット登録が完了しました');
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
          <p className="loading-text">都道府県データを読み込み中...</p>
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

  return (
    <div className="form-page">
      <div className="form-container">
        <div className="form-header">
          <h2 className="form-title">新規サーキット登録</h2>
          <p className="form-subtitle">新しいサーキット情報を入力してください</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              サーキット名 <span className="required-mark">*</span>
            </label>
            <input 
              className="form-input"
              type="text" 
              maxLength="20" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
              placeholder="例: フェスティカサーキット栃木"
            />
            <p className="form-hint">最大20文字まで入力できます</p>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              サーキット略称 <span className="required-mark">*</span>
            </label>
            <input 
              className="form-input"
              type="text" 
              maxLength="3" 
              value={shortName} 
              onChange={handleShortNameChange} 
              required 
              placeholder="例: FST"
            />
            <p className="form-hint">英字大文字3文字以下で入力してください</p>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              都道府県 <span className="required-mark">*</span>
            </label>
            <select 
              className="form-select"
              value={prefecture} 
              onChange={(e) => setPrefecture(e.target.value)} 
              required
            >
              <option value="">選択してください</option>
              {prefectures.map(pref => (
                <option key={pref.id} value={pref.name}>
                  {pref.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              ホームページ <span className="optional-mark">（任意）</span>
            </label>
            <input 
              className="form-input"
              type="url" 
              value={homepageUrl} 
              onChange={(e) => setHomepageUrl(e.target.value)} 
              placeholder="例: https://www.festika-circuit.com/"
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

export default NewTrackForm; 