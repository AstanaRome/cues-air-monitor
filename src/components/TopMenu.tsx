'use client';

import { useState, useRef, useEffect } from 'react';
import '../styles/top-menu.scss';

export default function TopMenu() {
  const [activeTab, setActiveTab] = useState('map');
  const [indicatorDropdownOpen, setIndicatorDropdownOpen] = useState(false);
  const [sensorsDropdownOpen, setSensorsDropdownOpen] = useState(false);

  const indicatorRef = useRef<HTMLDivElement>(null);
  const sensorsRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: 'map', label: 'Карта', color: '#0C8CE9' },
    { id: 'menu', label: 'Меню', color: '#00182A' },
    { id: 'indicator', label: 'Показатель', color: '#00182A' },
    { id: 'sensors', label: 'Все датчики', color: '#00182A' }
  ];

  const indicatorOptions = [
    { id: 'pm1', label: 'Загрязнитель PM XX', value: 'pm1' },
    { id: 'pm2', label: 'Загрязнитель PM XX', value: 'pm2' },
    { id: 'pm3', label: 'Загрязнитель PM XX', value: 'pm3' },
    { id: 'pm4', label: 'Загрязнитель PM XX', value: 'pm4', selected: true },
    { id: 'pm5', label: 'Загрязнитель PM XX', value: 'pm5' }
  ];

  const sensorOptions = [
    { id: 'all', label: 'Все показатели', value: 'all' },
    { id: 'home', label: 'Домашние', value: 'home' },
    { id: 'virtual', label: 'Виртуальные', value: 'virtual' }
  ];

  // Закрытие выпадающих списков при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (indicatorRef.current && !indicatorRef.current.contains(event.target as Node)) {
        setIndicatorDropdownOpen(false);
      }
      if (sensorsRef.current && !sensorsRef.current.contains(event.target as Node)) {
        setSensorsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleIndicatorClick = () => {
    setIndicatorDropdownOpen(!indicatorDropdownOpen);
    setSensorsDropdownOpen(false);
  };

  const handleSensorsClick = () => {
    setSensorsDropdownOpen(!sensorsDropdownOpen);
    setIndicatorDropdownOpen(false);
  };

  const handleIndicatorSelect = (value: string) => {
    setIndicatorDropdownOpen(false);
  };

  const handleSensorSelect = (value: string) => {
    setSensorsDropdownOpen(false);
  };

  return (
    <>
      <div className="top-menu" style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '44px',
        boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.05), 0px 8px 16.6px rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(6.3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        minWidth: '400px'
      }}>
        {/* Логотип */}
        <div className="logo" style={{ width: '115px', height: '20px', background: '#00182A' }}>
          <div className="logo-union"></div>
        </div>

        {/* Навигация */}
        <div className="nav-items" style={{ display: 'flex', gap: '24px' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'indicator') {
                  handleIndicatorClick();
                } else if (item.id === 'sensors') {
                  handleSensorsClick();
                } else {
                  setActiveTab(item.id);
                }
              }}
              style={{
                cursor: 'pointer',
                color: activeTab === item.id ? '#0C8CE9' : '#00182A',
                fontWeight: activeTab === item.id ? '600' : '500',
                fontSize: '16px'
              }}
            >
              <span className="nav-label">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Выпадающие селекты под топ-меню */}
      <div className="top-menu-dropdowns" style={{
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        pointerEvents: 'none'
      }}>
        {/* Выпадающий список показателей */}
        <div
          className={`indicators-dropdown ${indicatorDropdownOpen ? 'active' : ''}`}
          ref={indicatorRef}
          style={{
            position: 'absolute',
            top: '0',
            right: '32px',
            width: '240px',
            background: '#FFFFFF',
            boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.05), 0px 8px 16.6px rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(6.3px)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            opacity: indicatorDropdownOpen ? 1 : 0,
            visibility: indicatorDropdownOpen ? 'visible' : 'hidden',
            transform: indicatorDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.2s ease',
            pointerEvents: indicatorDropdownOpen ? 'auto' : 'none'
          }}
        >
          {indicatorOptions.map((option) => (
            <div
              key={option.id}
              className={`dropdown-item ${option.selected ? 'selected' : ''}`}
              onClick={() => handleIndicatorSelect(option.value)}
              style={{
                width: '208px',
                height: '20px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: option.selected ? '600' : '500',
                fontSize: '16px',
                lineHeight: '20px',
                color: option.selected ? '#0C8CE9' : '#00182A',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                padding: '4px 0'
              }}
              onMouseEnter={(e) => {
                if (!option.selected) {
                  e.currentTarget.style.color = '#0C8CE9';
                }
              }}
              onMouseLeave={(e) => {
                if (!option.selected) {
                  e.currentTarget.style.color = '#00182A';
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>

        {/* Выпадающий список датчиков */}
        <div
          className={`sensors-dropdown ${sensorsDropdownOpen ? 'active' : ''}`}
          ref={sensorsRef}
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '240px',
            background: '#FFFFFF',
            boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.05), 0px 8px 16.6px rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(6.3px)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            opacity: sensorsDropdownOpen ? 1 : 0,
            visibility: sensorsDropdownOpen ? 'visible' : 'hidden',
            transform: sensorsDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'all 0.2s ease',
            pointerEvents: sensorsDropdownOpen ? 'auto' : 'none'
          }}
        >
          {sensorOptions.map((option) => (
            <div
              key={option.id}
              className="dropdown-item"
              onClick={() => handleSensorSelect(option.value)}
              style={{
                width: '208px',
                height: '20px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: '500',
                fontSize: '16px',
                lineHeight: '20px',
                color: '#00182A',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                padding: '4px 0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#0C8CE9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#00182A';
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 