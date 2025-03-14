// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate
import './Header.css'; // スタイルを別ファイルに分ける場合

function Header() {
  const navigate = useNavigate(); // useNavigateフックを使用
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ウィンドウサイズの変更を検知
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNewRaceClick = () => {
    // 新しいタブで新規レース登録画面を開く
    window.open('/new-race', '_blank'); // '_blank'で新しいタブを開く
    if (isMobile) setIsMenuOpen(false);
  };

  const handleNewTrackClick = () => {
    // 新しいタブで新規サーキット登録画面を開く
    window.open('/new-track', '_blank');
    if (isMobile) setIsMenuOpen(false);
  };

  const handleTrackListClick = () => {
    window.open('/tracks', '_blank');
    if (isMobile) setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    if (isMobile) setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-branding">
          <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <span className="logo-main">Enjoy Rental Kart Race</span>
            <h1 className="navbar-title">Race Schedule</h1>
          </div>
        </div>
        
        {isMobile ? (
          <>
            <button 
              className="mobile-menu-button" 
              onClick={toggleMenu}
              aria-label="メニューを開く"
            >
              <span className={`hamburger-icon ${isMenuOpen ? 'open' : ''}`}></span>
            </button>
            
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
              <button
                onClick={handleTrackListClick}
                className="mobile-menu-item"
              >
                サーキット一覧
              </button>
              <button
                onClick={handleNewTrackClick}
                className="mobile-menu-item"
              >
                新規サーキット登録
              </button>
              <button
                onClick={handleNewRaceClick}
                className="mobile-menu-item"
              >
                新規レース登録
              </button>
            </div>
            
            {/* オーバーレイ */}
            {isMenuOpen && (
              <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}></div>
            )}
          </>
        ) : (
          <div className="navbar-menu">
            <button
              onClick={handleTrackListClick}
              className="navbar-item"
            >
              サーキット一覧
            </button>
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
        )}
      </div>
    </nav>
  );
}

export default Header;