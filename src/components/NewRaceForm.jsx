import React from 'react';
import './NewRaceForm.css'; // スタイルを別ファイルに分ける場合

function NewRaceForm({ onClose }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // フォーム送信処理をここに追加
    onClose(); // フォーム送信後に閉じる
  };

  return (
    <div className="form-container">
      <h2>新規レース登録</h2>
      <form onSubmit={handleSubmit}>
        <label>
          レース名:
          <input type="text" required />
        </label>
        <button type="submit">登録</button>
        <button type="button" onClick={onClose}>キャンセル</button>
      </form>
    </div>
  );
}

export default NewRaceForm; 