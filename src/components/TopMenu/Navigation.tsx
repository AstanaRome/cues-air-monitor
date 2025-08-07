interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onIndicatorClick: () => void;
  onSensorsClick: () => void;
}

export default function Navigation({ 
  activeTab, 
  onTabChange, 
  onIndicatorClick, 
  onSensorsClick 
}: NavigationProps) {
  const menuItems = [
    { id: 'map', label: 'Карта', color: '#0C8CE9' },
    { id: 'menu', label: 'Меню', color: '#00182A' },
    { id: 'indicator', label: 'Показатель', color: '#00182A' },
    { id: 'sensors', label: 'Все датчики', color: '#00182A' }
  ];

  return (
    <div className="nav-items">
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => {
            if (item.id === 'indicator') {
              onIndicatorClick();
            } else if (item.id === 'sensors') {
              onSensorsClick();
            } else {
              onTabChange(item.id);
            }
          }}
        >
          <span className="nav-label">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
} 