import React from 'react';
import './Legend.css';

const Legend = ({ raceFormatColors }) => {
  const formats = [
    { id: 0, name: 'スプリント' },
    { id: 1, name: '耐久' },
    { id: 2, name: 'MIX' }
  ];

  return (
    <div className="legend-container">
      <div className="legend-items">
        {formats.map(format => (
          <div key={format.id} className="legend-item">
            <span 
              className="legend-color" 
              style={{ backgroundColor: raceFormatColors[format.id] }}
            ></span>
            <span className="legend-label">{format.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend; 