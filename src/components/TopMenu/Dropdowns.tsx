import { useRef, useEffect } from 'react';

interface DropdownsProps {
  indicatorDropdownOpen: boolean;
  sensorsDropdownOpen: boolean;
  onIndicatorSelect: (value: string) => void;
  onSensorSelect: (value: string) => void;
  onIndicatorClose: () => void;
  onSensorsClose: () => void;
}

export default function Dropdowns({
  indicatorDropdownOpen,
  sensorsDropdownOpen,
  onIndicatorSelect,
  onSensorSelect,
  onIndicatorClose,
  onSensorsClose
}: DropdownsProps) {
  const indicatorRef = useRef<HTMLDivElement>(null);
  const sensorsRef = useRef<HTMLDivElement>(null);

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
        onIndicatorClose();
      }
      if (sensorsRef.current && !sensorsRef.current.contains(event.target as Node)) {
        onSensorsClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onIndicatorClose, onSensorsClose]);

  return (
    <div className="top-menu-dropdowns">
      {/* Выпадающий список показателей */}
      <div
        className={`indicators-dropdown ${indicatorDropdownOpen ? 'active' : ''}`}
        ref={indicatorRef}
      >
        {indicatorOptions.map((option) => (
          <div
            key={option.id}
            className={`dropdown-item ${option.selected ? 'selected' : ''}`}
            onClick={() => onIndicatorSelect(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>

      {/* Выпадающий список датчиков */}
      <div
        className={`sensors-dropdown ${sensorsDropdownOpen ? 'active' : ''}`}
        ref={sensorsRef}
      >
        {sensorOptions.map((option) => (
          <div
            key={option.id}
            className="dropdown-item"
            onClick={() => onSensorSelect(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
} 