'use client';

import { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [mapId] = useState(() => `map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

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
        height: '100%', 
        width: '100%',
        position: 'relative'
      }}
    />
  );
} 