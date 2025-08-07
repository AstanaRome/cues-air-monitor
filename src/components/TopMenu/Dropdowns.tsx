import { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  fetchAirQualityData, 
  selectAirQualityData, 
  selectLoading, 
  selectSelectedIndicator,
  selectSelectedSensorType
} from '../../store/slices/airQualitySlice';

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
  const dispatch = useAppDispatch();
  const indicatorRef = useRef<HTMLDivElement>(null);
  const sensorsRef = useRef<HTMLDivElement>(null);
  
  // Получаем данные из Redux store
  const airQualityData = useAppSelector(selectAirQualityData);
  const loading = useAppSelector(selectLoading);
  const selectedIndicator = useAppSelector(selectSelectedIndicator);
  const selectedSensorType = useAppSelector(selectSelectedSensorType);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchAirQualityData('2025-08-01T12:00:00Z'));
  }, [dispatch]);

  const indicatorOptions = [
    { id: 'pm25', label: 'Загрязнитель PM2.5', value: 'pm25' },
    { id: 'pm10', label: 'Загрязнитель PM10', value: 'pm10' },
    { id: 'pm1', label: 'Загрязнитель PM1', value: 'pm1' }
  ];

  const sensorOptions = [
    { id: 'all', label: 'Все датчики', value: 'all' },
    { id: 'street', label: 'Уличные датчики', value: 'street' },
    { id: 'inside', label: 'Домашние датчики', value: 'inside' }
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
        {loading ? (
          <div className="dropdown-item">⏳ Загрузка данных...</div>
        ) : (
          <>
            {indicatorOptions.map((option) => {
              return (
                <div
                  key={option.id}
                  className={`dropdown-item ${selectedIndicator === option.value ? 'selected' : ''}`}
                  onClick={() => onIndicatorSelect(option.value)}
                >
                  {option.label}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Выпадающий список датчиков */}
      <div
        className={`sensors-dropdown ${sensorsDropdownOpen ? 'active' : ''}`}
        ref={sensorsRef}
      >
        {loading ? (
          <div className="dropdown-item">⏳ Загрузка данных...</div>
        ) : (
          sensorOptions.map((option) => {
            // Подсчитываем количество датчиков в каждой категории
            let count = 0;
            if (airQualityData.length > 0) {
              switch (option.value) {
                case 'all':
                  count = airQualityData.length;
                  break;
                case 'street':
                  count = airQualityData.filter(item => item.sensor.placement === 'STREET').length;
                  break;
                case 'inside':
                  count = airQualityData.filter(item => item.sensor.placement === 'INSIDE').length;
                  break;
              }
            }

            return (
              <div
                key={option.id}
                className={`dropdown-item ${selectedSensorType === option.value ? 'selected' : ''}`}
                onClick={() => onSensorSelect(option.value)}
              >
                {option.label} ({count})
              </div>
            );
          })
        )}
      </div>
    </div>
  );
} 