'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '../hooks/redux';
import { 
  selectFilteredData, 
  selectSelectedIndicator, 
  getIndicatorColor, 
  getIndicatorLevel 
} from '../store/slices/airQualitySlice';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [mapId] = useState(() => `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  // Получаем данные из Redux store
  const filteredData = useAppSelector(selectFilteredData);
  const selectedIndicator = useAppSelector(selectSelectedIndicator);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let map: any = null;

    const initMap = async () => {
      try {
        // Динамически импортируем Leaflet только в браузере
        const L = (await import('leaflet')).default;

        // Убеждаемся, что контейнер существует и не содержит карту
        if (mapRef.current && !leafletMapRef.current) {
          // Очищаем контейнер от возможных остатков
          mapRef.current.innerHTML = '';
          
          // Устанавливаем уникальный ID для контейнера
          mapRef.current.id = mapId;

          // Создаем карту
          map = L.map(mapRef.current, {
            center: [43.2389, 76.8897],
            zoom: 12,
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            boxZoom: true,
            keyboard: true,
            dragging: true,
            touchZoom: true
          });

          // Добавляем тайловый слой
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
          }).addTo(map);

          // Сохраняем ссылку на карту
          leafletMapRef.current = map;

          console.log(`Map ${mapId} initialized successfully`);
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    // Инициализируем карту с небольшой задержкой для стабильности
    const timeoutId = setTimeout(initMap, 150);

    // Очистка при размонтировании
    return () => {
      clearTimeout(timeoutId);
      
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
          console.log(`Map ${mapId} removed successfully`);
        } catch (error) {
          console.error('Error removing map:', error);
        }
        leafletMapRef.current = null;
      }

      // Дополнительная очистка DOM
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [isClient, mapId]);

  // Эффект для обновления маркеров при изменении данных или выбранного показателя
  useEffect(() => {
    if (leafletMapRef.current && filteredData.length > 0) {
      console.log('Обновляем маркеры на карте для показателя:', selectedIndicator);
      updateMapMarkers();
    }
  }, [filteredData, selectedIndicator]);

  const updateMapMarkers = async () => {
    if (!leafletMapRef.current) return;

    try {
      const L = (await import('leaflet')).default;

      // Очищаем существующие маркеры
      leafletMapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          leafletMapRef.current.removeLayer(layer);
        }
      });

      // Добавляем новые маркеры
      filteredData.forEach((item) => {
        const value = getIndicatorValue(item, selectedIndicator);
        if (value !== null) {
          addMarkerToMap(item.sensor.lat, item.sensor.lng, value, selectedIndicator, item.sensor.name);
        }
      });
    } catch (error) {
      console.error('Ошибка при обновлении маркеров:', error);
    }
  };

  const getIndicatorValue = (item: any, indicator: string): number | null => {
    switch (indicator) {
      case 'pm25':
        return item.particulate_matter.pm25;
      case 'pm10':
        return item.particulate_matter.pm10;
      case 'pm1':
        return item.particulate_matter.pm1;
      default:
        return null;
    }
  };

  const addMarkerToMap = async (lat: number, lng: number, value: number, indicator: string, name: string) => {
    if (!leafletMapRef.current) return;

    try {
      const L = (await import('leaflet')).default;
      
      // Получаем цвет и уровень загрязнения
      const color = getIndicatorColor(indicator, value);
      const level = getIndicatorLevel(indicator, value);
      
      // Создаем кастомную иконку с цветом
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 20px; 
          height: 20px; 
          background-color: ${color}; 
          border: 2px solid white; 
          border-radius: 50%; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      // Создаем маркер с информацией о показателе
      const marker = L.marker([lat, lng], { icon: customIcon })
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #333;">${name}</h3>
            <p style="margin: 4px 0;">
              <strong>${getIndicatorLabel(indicator)}:</strong> 
              <span style="color: ${color}; font-weight: bold;">${value}</span>
            </p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              Уровень: <span style="color: ${color};">${level}</span>
            </p>
          </div>
        `)
        .addTo(leafletMapRef.current);
    } catch (error) {
      console.error('Ошибка при добавлении маркера:', error);
    }
  };

  const getIndicatorLabel = (indicator: string): string => {
    switch (indicator) {
      case 'pm25':
        return 'PM2.5 (μg/m³)';
      case 'pm10':
        return 'PM10 (μg/m³)';
      case 'pm1':
        return 'PM1 (μg/m³)';
      default:
        return indicator;
    }
  };

  if (!isClient) {
    return (
      <div style={{ height: '100%', width: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      style={{ 
        height: '100vh', 
        width: '100vw',
        position: 'relative'
      }}
    />
  );
} 