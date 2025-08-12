import React, { useState } from "react";
import FiltroCard from "../visor-ui/FiltroCard";


interface CheckboxOption {
    id: string;
    label: string;
    checked: boolean;
}

const FiltroDiscapacidad: React.FC<{ forceRecalculate?: boolean }> = ({ forceRecalculate }) => {

    const [options, setOptions] = useState<CheckboxOption[]>([
        { id: "1", label: "Física", checked: false },
        { id: "2", label: "Auditiva", checked: false },
        { id: "3", label: "Visual", checked: false },
        { id: "4", label: "Sordo ceguera", checked: false },
        { id: "5", label: "Psicosocial (mental)", checked: false },
        { id: "6", label: "Intelectual", checked: false },
        { id: "7", label: "Talla baja", checked: false },
        { id: "8", label: "Múltiple", checked: false },
    ]);

    const handleCheckboxChange = (id: string) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, checked: !option.checked } : option
        ));
    };

    return (
        <FiltroCard title="Discapacidad" forceRecalculate={forceRecalculate}>
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
}

export { FiltroDiscapacidad }