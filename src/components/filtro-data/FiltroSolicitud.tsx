import React, { useState } from "react";
import FiltroCard from "../visor-ui/FiltroCard";

type Solicitud = 'individual' | 'colectiva' | null;

interface CheckboxOption {
  id: number;
  label: string;    // "Individual" | "Colectiva"
  checked: boolean;
}

interface Props {
  forceRecalculate?: boolean;
  onChange?: (value: Solicitud) => void;
}

const FiltroSolicitud: React.FC<Props> = ({ forceRecalculate, onChange }) => {
  const [options, setOptions] = useState<CheckboxOption[]>([
    { id: 1, label: "Individual", checked: false },
    { id: 2, label: "Colectiva", checked: false },
  ]);

  const handleCheckboxChange = (id: number) => {
    setOptions(prev => {
      const next = prev.map(option =>
        option.id === id
          ? { ...option, checked: !option.checked }
          : { ...option, checked: false }
      );

      const selected = next.find(o => o.checked)?.label.toLowerCase() as 'individual' | 'colectiva' | undefined;
      onChange?.(selected ?? null);
      return next;
    });
  };

  return (
    <FiltroCard title="Solicitud" forceRecalculate={forceRecalculate}>
      <div className="checkbox-container">
        {options.map(option => (
          <div
            key={option.id}
            className="checkbox-item"
            onClick={() => handleCheckboxChange(option.id)}
          >
            <div className={`custom-checkbox ${option.checked ? "checked" : ""}`}>
              {option.checked && (
                <svg className="check-icon" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
              )}
            </div>
            <span className="checkbox-label">{option.label}</span>
          </div>
        ))}
      </div>
    </FiltroCard>
  );
};

export { FiltroSolicitud };