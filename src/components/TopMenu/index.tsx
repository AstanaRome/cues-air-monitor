'use client';

import { useState } from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import Dropdowns from './Dropdowns';
import { useAppDispatch } from '../../hooks/redux';
import { setSelectedIndicator, setSelectedSensorType } from '../../store/slices/airQualitySlice';
import '../../styles/top-menu.scss';

export default function TopMenu() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('map');
  const [indicatorDropdownOpen, setIndicatorDropdownOpen] = useState(false);
  const [sensorsDropdownOpen, setSensorsDropdownOpen] = useState(false);

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
    // Обновляем выбранный показатель в Redux store
    dispatch(setSelectedIndicator(value));
  };

  const handleSensorSelect = (value: string) => {
    setSensorsDropdownOpen(false);
    // Обновляем выбранный тип датчиков в Redux store
    dispatch(setSelectedSensorType(value));
  };

  return (
    <>
      <div className="top-menu">
        <Logo />
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onIndicatorClick={handleIndicatorClick}
          onSensorsClick={handleSensorsClick}
        />
      </div>

      <Dropdowns
        indicatorDropdownOpen={indicatorDropdownOpen}
        sensorsDropdownOpen={sensorsDropdownOpen}
        onIndicatorSelect={handleIndicatorSelect}
        onSensorSelect={handleSensorSelect}
        onIndicatorClose={() => setIndicatorDropdownOpen(false)}
        onSensorsClose={() => setSensorsDropdownOpen(false)}
      />
    </>
  );
} 