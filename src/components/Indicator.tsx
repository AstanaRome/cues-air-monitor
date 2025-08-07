import { getIndicatorBackgroundColor } from '../store/slices/airQualitySlice';

interface IndicatorProps {
  value: number;
  indicator: string;
  size?: 'small' | 'medium' | 'large';
}

export default function Indicator({ value, indicator, size = 'medium' }: IndicatorProps) {
  const backgroundColor = getIndicatorBackgroundColor(indicator, value);
  
  // Размеры в зависимости от размера индикатора
  const sizeConfig = {
    small: {
      width: '32px',
      height: '24px',
      fontSize: '10px',
      borderRadius: '22px'
    },
    medium: {
      width: '48px',
      height: '36px',
      fontSize: '12px',
      borderRadius: '34px'
    },
    large: {
      width: '64px',
      height: '48px',
      fontSize: '14px',
      borderRadius: '44px'
    }
  };

  const config = sizeConfig[size];

  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: config.width,
        height: config.height,
        background: backgroundColor,
        border: '2px solid rgba(0, 0, 0, 0.05)',
        boxShadow: '0px 3px 4px rgba(0, 0, 0, 0.05), 0px 8px 16.6px rgba(0, 0, 0, 0.12)',
        borderRadius: config.borderRadius,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: config.fontSize,
        lineHeight: config.fontSize,
        textAlign: 'center',
        color: '#00182A'
      }}
    >
      {Math.round(value)}
    </div>
  );
} 