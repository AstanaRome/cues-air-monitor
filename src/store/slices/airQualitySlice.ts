import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Интерфейсы
export interface AirQualityData {
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

export interface AirQualityState {
  data: AirQualityData[];
  loading: boolean;
  error: string | null;
  selectedIndicator: string;
  selectedDate: string;
}

// Цветовые схемы для разных показателей
export const getPM25Color = (value: number): string => {
  if (value <= 12) return '#4CAF50'; // 🟩 Зелёный
  if (value <= 35.4) return '#FFC107'; // 🟨 Жёлтый
  if (value <= 55.4) return '#FF9800'; // 🟧 Оранжевый
  return '#F44336'; // 🟥 Красный
};

export const getPM10Color = (value: number): string => {
  if (value <= 20) return '#4CAF50'; // 🟩 Зелёный
  if (value <= 50) return '#FFC107'; // 🟨 Жёлтый
  if (value <= 100) return '#FF9800'; // 🟧 Оранжевый
  return '#F44336'; // 🟥 Красный
};

export const getPM1Color = (value: number): string => {
  if (value <= 10) return '#4CAF50'; // 🟩 Зелёный
  if (value <= 25) return '#FFC107'; // 🟨 Жёлтый
  if (value <= 50) return '#FF9800'; // 🟧 Оранжевый
  return '#F44336'; // 🟥 Красный
};

export const getIndicatorColor = (indicator: string, value: number): string => {
  switch (indicator) {
    case 'pm25':
      return getPM25Color(value);
    case 'pm10':
      return getPM10Color(value);
    case 'pm1':
      return getPM1Color(value);
    default:
      return '#9E9E9E'; // Серый по умолчанию
  }
};

export const getIndicatorLevel = (indicator: string, value: number): string => {
  switch (indicator) {
    case 'pm25':
      if (value <= 12) return 'Хороший';
      if (value <= 35.4) return 'Умеренный';
      if (value <= 55.4) return 'Вреден для чувствительных групп';
      return 'Вреден для всех';
    case 'pm10':
      if (value <= 20) return 'Хороший';
      if (value <= 50) return 'Умеренный';
      if (value <= 100) return 'Вреден для чувствительных групп';
      return 'Вреден для всех';
    case 'pm1':
      if (value <= 10) return 'Хороший';
      if (value <= 25) return 'Умеренный';
      if (value <= 50) return 'Вреден для чувствительных групп';
      return 'Вреден для всех';
    default:
      return 'Неизвестно';
  }
};

// Async thunk для загрузки данных
export const fetchAirQualityData = createAsyncThunk(
  'airQuality/fetchData',
  async (date: string = '2025-08-01T12:00:00Z') => {
    const response = await fetch(`https://test.cuesproject.com/api/air-quality/date?date=${date}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  }
);

// Начальное состояние
const initialState: AirQualityState = {
  data: [],
  loading: false,
  error: null,
  selectedIndicator: 'pm25',
  selectedDate: '2025-08-01T12:00:00Z',
};

// Slice
const airQualitySlice = createSlice({
  name: 'airQuality',
  initialState,
  reducers: {
    setSelectedIndicator: (state, action: PayloadAction<string>) => {
      state.selectedIndicator = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAirQualityData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAirQualityData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAirQualityData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки данных';
      });
  },
});

// Экспорты
export const { setSelectedIndicator, setSelectedDate, clearError } = airQualitySlice.actions;
export default airQualitySlice.reducer;

// Селекторы
export const selectAirQualityData = (state: { airQuality: AirQualityState }) => state.airQuality.data;
export const selectLoading = (state: { airQuality: AirQualityState }) => state.airQuality.loading;
export const selectError = (state: { airQuality: AirQualityState }) => state.airQuality.error;
export const selectSelectedIndicator = (state: { airQuality: AirQualityState }) => state.airQuality.selectedIndicator;
export const selectSelectedDate = (state: { airQuality: AirQualityState }) => state.airQuality.selectedDate;

// Селектор для фильтрации данных по выбранному показателю
export const selectFilteredData = (state: { airQuality: AirQualityState }) => {
  const { data, selectedIndicator } = state.airQuality;
  return data.filter(item => {
    switch (selectedIndicator) {
      case 'pm25':
        return item.particulate_matter.pm25 !== null;
      case 'pm10':
        return item.particulate_matter.pm10 !== null;
      case 'pm1':
        return item.particulate_matter.pm1 !== null;
      default:
        return true;
    }
  });
}; 