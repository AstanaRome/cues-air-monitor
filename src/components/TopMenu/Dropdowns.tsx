import { useRef, useEffect, useState } from 'react';

interface AirQualityData {
  sensor: {
    name: string;
    lat: number;
    lng: number;
    source: string;
    id_from_source: string;
    isFaulty: string;
    placement: string;
  };
  particulate_matter: {
    pm25: number | null;
    pm10: number | null;
    pm1: number | null;
    aqi: number | null;
    pm25_aqi: number | null;
    pm10_aqi: number | null;
  };
  physical_data_air: {
    humidity: number | null;
    temperature: number | null;
  };
  instant_created_at: string;
}

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
  const [airQualityData, setAirQualityData] = useState<AirQualityData[]>([]);
  const [loading, setLoading] = useState(false);

  // Функция для получения данных качества воздуха
  const fetchAirQualityData = async (date: string = '2025-08-01T12:00:00Z') => {
    console.log('🎯 fetchAirQualityData вызвана с датой:', date);
    setLoading(true);
    try {
      console.log('🔄 Запрашиваем данные с API...');
      const url = `https://test.cuesproject.com/api/air-quality/date?date=${date}`;
      console.log('🌐 URL запроса:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      console.log('📡 Ответ от API:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Получены данные:', data.length, 'записей');
        console.log('📊 Пример данных:', data[0]);
        setAirQualityData(data);
      } else {
        console.error('❌ Ошибка при получении данных:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('📝 Текст ошибки:', errorText);
      }
    } catch (error) {
      console.error('💥 Ошибка при запросе к API:', error);
    } finally {
      console.log('🏁 Завершаем загрузку, устанавливаем loading = false');
      setLoading(false);
    }
  };

  // Получаем данные при монтировании компонента
  useEffect(() => {
    console.log('🚀 Компонент смонтирован, загружаем данные...');
    console.log('🔍 Вызываем fetchAirQualityData...');
    fetchAirQualityData().then(() => {
      console.log('✅ fetchAirQualityData завершен');
    }).catch((error) => {
      console.error('💥 Ошибка в fetchAirQualityData:', error);
    });
  }, []); // Убираем fetchAirQualityData из зависимостей

  // Функция для обновления данных
  const refreshData = () => {
    console.log('🔄 Обновляем данные...');
    fetchAirQualityData();
  };

  const indicatorOptions = [
    { id: 'pm25', label: 'Загрязнитель PM2.5', value: 'pm25' },
    { id: 'pm10', label: 'Загрязнитель PM10', value: 'pm10' },
    { id: 'pm1', label: 'Загрязнитель PM1', value: 'pm1' }
  ];

  const sensorOptions = [
    { id: 'all', label: 'Все датчики', value: 'all' },
    { id: 'street', label: 'Уличные датчики', value: 'street' },
    { id: 'inside', label: 'Внутренние датчики', value: 'inside' },
    { id: 'aqicn', label: 'AQICN источники', value: 'aqicn' },
    { id: 'claritty', label: 'Claritty датчики', value: 'claritty' }
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

  console.log('🎯 Рендер компонента. Данные:', airQualityData.length, 'записей, Загрузка:', loading);

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
                  className="dropdown-item"
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
                case 'aqicn':
                  count = airQualityData.filter(item => item.sensor.source === 'aqicn.org').length;
                  break;
                case 'claritty':
                  count = airQualityData.filter(item => item.sensor.source === 'Claritty').length;
                  break;
              }
            }

            return (
              <div
                key={option.id}
                className="dropdown-item"
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