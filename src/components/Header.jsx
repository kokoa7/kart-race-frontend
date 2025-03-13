// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate
import './Header.css'; // スタイルを別ファイルに分ける場合

function Header() {
  const navigate = useNavigate(); // useHistoryフックを使用

  const handleNewRaceClick = () => {
    navigate('/new-race'); // 修正: pushメソッドを使用しない
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">レーススケジュール</h1>
        <div className="navbar-menu">
          <button
            onClick={handleNewRaceClick} // クリックイベントを変更
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