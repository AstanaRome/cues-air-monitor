'use client';

import { useState, useEffect } from 'react';

interface LoadingModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function LoadingModal({ isVisible, onClose }: LoadingModalProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const loadingOptions = [
    { id: 'pm1', label: 'PM 1.0', description: 'Частицы ≤1 микрометра', unit: 'µg/m³' },
    { id: 'pm25', label: 'PM 2.5', description: 'Частицы ≤2.5 микрометра', unit: 'µg/m³' },
    { id: 'pm10', label: 'PM 10', description: 'Частицы ≤10 микрометров', unit: 'µg/m³' }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };



  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Выберите загрязнитель</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
                 <div className="modal-body">
           {loadingOptions.map((option) => (
             <div 
               key={option.id}
               className={`option-card ${selectedOption === option.id ? 'selected' : ''}`}
               onClick={() => handleOptionSelect(option.id)}
             >
               <div className="option-info">
                 <h3>{option.label}</h3>
               </div>
             </div>
           ))}
         </div>
        
        
      </div>
    </div>
  );
} 