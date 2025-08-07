'use client';

import { useEffect, useCallback } from 'react';
import { getIndicatorColor, getIndicatorLevel } from '../../store/slices/airQualitySlice';
import { AirQualityData } from '../../store/slices/airQualitySlice';

// Тип для Leaflet карты
type LeafletMap = any;

interface MapMarkersProps {
  map: LeafletMap;
  data: AirQualityData[];
  selectedIndicator: string;
}

export default function MapMarkers({ map, data, selectedIndicator }: MapMarkersProps) {
  const getIndicatorValue = (item: AirQualityData, indicator: string): number | null => {
    let value: number | null = null;
    
    switch (indicator) {
      case 'pm25':
        value = item.particulate_matter.pm25;
        break;
      case 'pm10':
        value = item.particulate_matter.pm10;
        break;
      case 'pm1':
        value = item.particulate_matter.pm1;
        break;
      default:
        return null;
    }
    
    // Проверяем, что значение не null, не undefined и является числом
    if (value === null || value === undefined || isNaN(value)) {
      return null;
    }
    
    return value;
  };

  const addMarkerToMap = useCallback(async (lat: number, lng: number, value: number, indicator: string, name: string, placement: string) => {
    if (!map) return;

    try {
      const L = (await import('leaflet')).default;
      
      // Получаем цвет и уровень загрязнения
      const color = getIndicatorColor(indicator, value);
      const level = getIndicatorLevel(indicator, value);
      
      // Определяем HTML для маркера в зависимости от типа датчика
      let markerHtml: string;
      let iconSize: [number, number];
      let iconAnchor: [number, number];
      
      if (placement === 'INSIDE') {
        // Используем SVG для домашних датчиков с цифрами внутри
        markerHtml = `
          <div class="marker-indicator inside-sensor">
            <svg width="50" height="43" viewBox="0 0 50 43" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.15869 19C0.182251 19 -0.215341 17.7441 0.583199 17.1822L23.849 0.809954C24.5394 0.324105 25.4606 0.324104 26.151 0.809954L49.4168 17.1822C50.2153 17.7441 49.8177 19 48.8413 19H43V41C43 42.1046 42.1046 43 41 43H9C7.89543 43 7 42.1046 7 41V19H1.15869Z" fill="#D3EB1E"/>
              <path d="M24.4248 1.62793C24.77 1.38512 25.23 1.38512 25.5752 1.62793L48.8408 18H42V41C42 41.5523 41.5523 42 41 42H9C8.44772 42 8 41.5523 8 41V18H1.15918L24.4248 1.62793Z" stroke="black" stroke-opacity="0.05" stroke-width="2"/>
              <text x="25" y="28" text-anchor="middle" font-family="Inter" font-weight="700" font-size="12" fill="#00182A">${Math.round(value)}</text>
            </svg>
          </div>
        `;
        iconSize = [50, 43];
        iconAnchor = [25, 21.5];
      } else {
        // Обычный маркер для уличных датчиков
        markerHtml = `<div class="marker-indicator" style="background: ${color}">
          ${Math.round(value)}
        </div>`;
        iconSize = [48, 36];
        iconAnchor = [24, 18];
      }
      
      // Создаем кастомную иконку
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: markerHtml,
        iconSize: iconSize,
        iconAnchor: iconAnchor
      });
      
      // Создаем HTML для popup с дополнительной информацией
      const popupContent = `
        <div class="marker-popup">
          <h3 class="marker-popup-title">${name}</h3>
          <div class="marker-popup-content">
            <div class="marker-popup-indicator" style="background: ${color}">
              ${Math.round(value)}
            </div>
            <div class="marker-popup-info">
              <p class="marker-popup-label">
                <strong>${getIndicatorLabel(indicator)}</strong>
              </p>
              <p class="marker-popup-level">
                ${level}
              </p>
            </div>
          </div>
        </div>
      `;
      
      // Создаем маркер с информацией о показателе
      L.marker([lat, lng], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(map);
    } catch (error) {
      console.error('Ошибка при добавлении маркера:', error);
    }
  }, [map]);

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

  const updateMapMarkers = useCallback(async () => {
    if (!map) return;

    try {
      const L = (await import('leaflet')).default;

      // Очищаем существующие маркеры
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Добавляем новые маркеры
      data.forEach((item) => {
        const value = getIndicatorValue(item, selectedIndicator);
        if (value !== null) {
          addMarkerToMap(item.sensor.lat, item.sensor.lng, value, selectedIndicator, item.sensor.name, item.sensor.placement);
        }
      });
    } catch (error) {
      console.error('Ошибка при обновлении маркеров:', error);
    }
  }, [map, data, selectedIndicator, addMarkerToMap]);

  useEffect(() => {
    if (map && data.length > 0) {
      console.log('Обновляем маркеры на карте для показателя:', selectedIndicator);
      updateMapMarkers();
    }
  }, [map, data, selectedIndicator, updateMapMarkers]);

  return null; // Этот компонент не рендерит ничего в DOM
} 