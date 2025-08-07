'use client';

import { useState } from 'react';

export default function TopMenu() {
  const [activeTab, setActiveTab] = useState('map');

  const menuItems = [
    { id: 'map', label: 'Карта', color: '#0C8CE9' },
    { id: 'menu', label: 'Меню', color: '#00182A' },
    { id: 'indicator', label: 'Показатель', color: '#00182A' },
    { id: 'sensors', label: 'Все датчики', color: '#00182A' }
  ];

  return (
    <div className="top-menu">
      {/* Логотип */}
      <div className="logo">
        <div className="logo-union"></div>
      </div>

      {/* Навигация */}
      <div className="nav-items">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-label">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 