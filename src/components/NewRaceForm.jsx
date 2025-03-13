import React, { useEffect, useState } from 'react';
import './NewRaceForm.css'; // スタイルを別ファイルに分ける場合

function NewRaceForm({ onClose }) {
  const [tracks, setTracks] = useState([]); // コース名の状態を管理
  const [selectedTrack, setSelectedTrack] = useState(''); // 選択されたコース名
  const [raceName, setRaceName] = useState(''); // レース名
  const [referenceUrl, setReferenceUrl] = useState(''); // 参考URL
  const [raceDate, setRaceDate] = useState(''); // 日付
  const [raceFormat, setRaceFormat] = useState(0); // レース形式の状態を管理

  const raceFormats = [
    { id: 0, name: 'スプリント' },
    { id: 1, name: '耐久' },
    { id: 2, name: 'MIX' },
  ];

  useEffect(() => {
    // APIからコース名を取得
    fetch('https://kart-race-api.onrender.com/tracks')
      .then(response => response.json())
      .then(data => setTracks(data));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

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
        // 成功メッセージを表示し、タイマーでウィンドウを閉じる
        alert('新規レース登録が完了しました');
        // アラートが閉じられた後にウィンドウを閉じる
        setTimeout(() => {
          window.close();
        }, 500); // 500ミリ秒後に閉じる
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('エラーが発生しました: ' + error.message);
      });
  };

  return (
    <div className="form-container">
      <h2>新規レース登録</h2>
      <form onSubmit={handleSubmit}>
        <label>
          日付:
          <input type="date" value={raceDate} onChange={(e) => setRaceDate(e.target.value)} required />
        </label>
        <label>
          コース名:
          <select value={selectedTrack} onChange={(e) => setSelectedTrack(e.target.value)} required>
            <option value="">選択してください</option>
            {tracks.map(track => (
              <option key={track.id} value={track.id}>
                {track.shortName} {track.fullName}
              </option>
            ))}
          </select>
        </label>
        <label>
          レース名:
          <input type="text" maxLength="30" value={raceName} onChange={(e) => setRaceName(e.target.value)} required />
        </label>
        <label>
          参考URL:
          <input type="text" maxLength="100" value={referenceUrl} onChange={(e) => setReferenceUrl(e.target.value)} />
        </label>
        <label>
          レース形式:
          <select value={raceFormat} onChange={(e) => setRaceFormat(Number(e.target.value))} required>
            {raceFormats.map(format => (
              <option key={format.id} value={format.id}>
                {format.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">登録</button>
        <button type="button" onClick={() => { 
            console.log('キャンセルボタンが押されました'); 
            window.close(); // 新しいタブを閉じる
        }}>キャンセル</button>
      </form>
    </div>
  );
}

export default NewRaceForm; 