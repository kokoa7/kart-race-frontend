import React, { useEffect, useState } from 'react';
import './NewTrackForm.css';

function NewTrackForm({ onClose }) {
  const [fullName, setFullName] = useState('');
  const [shortName, setShortName] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [homepageUrl, setHomepageUrl] = useState('');
  const [prefectures, setPrefectures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      });
  };

  if (isLoading) {
    return (
      <div className="form-container loading">
        <div className="spinner"></div>
        <p>都道府県データを読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="form-container error">
        <h2>エラーが発生しました</h2>
        <p>{error}</p>
        <button onClick={() => window.close()}>閉じる</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2>新規サーキット登録</h2>
      <form onSubmit={handleSubmit}>
        <label>
          サーキット名:
          <input 
            type="text" 
            maxLength="20" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required 
            placeholder="例: フェスティカサーキット栃木"
          />
        </label>
        
        <label>
          サーキット略称(3文字):
          <input 
            type="text" 
            maxLength="3" 
            value={shortName} 
            onChange={handleShortNameChange} 
            required 
            placeholder="例: FST"
          />
          <small>※英字大文字3文字以下</small>
        </label>
        
        <label>
          都道府県:
          <select 
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
        </label>
        
        <label>
          ホームページ:
          <input 
            type="url" 
            value={homepageUrl} 
            onChange={(e) => setHomepageUrl(e.target.value)} 
            placeholder="例: https://www.festika-circuit.com/"
          />
        </label>
        
        <div className="button-group">
          <button type="submit">登録</button>
          <button 
            type="button" 
            onClick={() => window.close()}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewTrackForm; 