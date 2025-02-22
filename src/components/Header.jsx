// src/components/Header.jsx
import React from 'react';
import './Header.css'; // スタイルを別ファイルに分ける場合

function Header() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">レーススケジュール</h1>
        <nav className="navbar-menu">
          <a href="/" className="navbar-item">ホーム</a>
          <a href="/schedule" className="navbar-item">スケジュール</a>
          <a href="/events" className="navbar-item">イベント</a>
          <a href="/contact" className="navbar-item">お問い合わせ</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;