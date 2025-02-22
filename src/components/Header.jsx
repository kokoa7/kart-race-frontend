// src/components/Header.jsx
import React, { useState } from 'react';
import './Header.css'; // スタイルを別ファイルに分ける場合
import NewRaceModal from './NewRaceModal';

function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">レーススケジュール</h1>
        <div className="navbar-menu">
          <button
            onClick={() => setIsModalOpen(true)}
            className="navbar-item bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            新規レース登録
          </button>
        </div>
      </div>
      <NewRaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
}

export default Header;