// src/components/Header.jsx
import React from 'react';
import { useHistory } from 'react-router-dom'; // useHistoryをインポート
import './Header.css'; // スタイルを別ファイルに分ける場合

function Header() {
  const history = useHistory(); // useHistoryフックを使用

  const handleNewRaceClick = () => {
    history.push('/new-race'); // 新しいタブではなく、ルーティングを使用
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">レーススケジュール</h1>
        <div className="navbar-menu">
          <button
            onClick={handleNewRaceClick}
            className="navbar-item"
          >
            新規レース登録
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Header;