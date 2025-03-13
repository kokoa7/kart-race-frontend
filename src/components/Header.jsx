// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate
import './Header.css'; // スタイルを別ファイルに分ける場合

function Header() {
  const navigate = useNavigate(); // useNavigateフックを使用

  const handleNewRaceClick = () => {
    // 新しいタブで新規レース登録画面を開く
    window.open('/new-race', '_blank'); // '_blank'で新しいタブを開く
  };

  const handleNewTrackClick = () => {
    // 新しいタブで新規サーキット登録画面を開く
    window.open('/new-track', '_blank');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-branding">
          <div className="navbar-logo">
            <span className="logo-main">Enjoy Rental Kart Race</span>
            <h1 className="navbar-title">Race Schedule</h1>
          </div>
        </div>
        <div className="navbar-menu">
          <button
            onClick={handleNewTrackClick}
            className="navbar-item"
          >
            新規サーキット登録
          </button>
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