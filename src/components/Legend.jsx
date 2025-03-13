import React from 'react';
import '../components/CalendarStyles.css';

const Legend = ({ raceFormatColors }) => {
  return (
    <div className="legend-container">
      <h3 className="legend-title">レース形式</h3>
      <div className="legend-items">
        <div className="legend-item">
          <div 
            className="legend-color" 
            style={{ 
              background: `linear-gradient(135deg, ${raceFormatColors[0]} 0%, #e53e3e 100%)`,
            }}
          ></div>
          <span className="legend-label">スプリント</span>
        </div>
        <div className="legend-item">
          <div 
            className="legend-color" 
            style={{ 
              background: `linear-gradient(135deg, ${raceFormatColors[1]} 0%, #3a8ad6 100%)`,
            }}
          ></div>
          <span className="legend-label">耐久</span>
        </div>
        <div className="legend-item">
          <div 
            className="legend-color" 
            style={{ 
              background: `linear-gradient(135deg, ${raceFormatColors[2]} 0%, #388E3C 100%)`,
            }}
          ></div>
          <span className="legend-label">MIX</span>
        </div>
      </div>
    </div>
  );
};

export default Legend; 