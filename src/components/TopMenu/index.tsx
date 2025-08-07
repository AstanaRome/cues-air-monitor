'use client';

import { useState } from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import Dropdowns from './Dropdowns';

export default function TopMenu() {
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
  };

  const handleSensorSelect = (value: string) => {
    setSensorsDropdownOpen(false);
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