import { configureStore } from '@reduxjs/toolkit';
import airQualityReducer from './slices/airQualitySlice';

export const store = configureStore({
  reducer: {
    airQuality: airQualityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['airQuality/fetchData/pending', 'airQuality/fetchData/fulfilled', 'airQuality/fetchData/rejected'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 