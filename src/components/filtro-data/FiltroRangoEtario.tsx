import React, { useState } from "react";

import FiltroCard from "../visor-ui/FiltroCard";



interface CheckboxOption {
    id: string;
    label: string;
    checked: boolean;
}

const FiltroRangoEtario: React.FC<{ forceRecalculate?: boolean }> = ({ forceRecalculate }) => {

    const [options, setOptions] = useState<CheckboxOption[]>([
        { id: "1", label: "Niña o Niño (de 0 a 12 años)", checked: false },
        { id: "2", label: "Adolescente (de 13 a 17 años)", checked: false },
        { id: "3", label: "Joven (de 18 a 27 años)", checked: false },
        { id: "4", label: "Adulto (de 28 a 59 años)", checked: false },
        { id: "5", label: "Adulto mayor (desde los 60 años)", checked: false },
    ]);

    const handleCheckboxChange = (id: string) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, checked: !option.checked } : option
        ));
    };

    return (
        <FiltroCard title="Rango etario" forceRecalculate={forceRecalculate}>
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

export { FiltroRangoEtario }