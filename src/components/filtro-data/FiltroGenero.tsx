import React, { useState } from "react";
import FiltroCard from "../visor-ui/FiltroCard";

interface CheckboxOption {
    id: string;
    label: string;
    checked: boolean;
}

const FiltroGenero: React.FC<{ forceRecalculate?: boolean }> = ({ forceRecalculate }) => {

    const [options, setOptions] = useState<CheckboxOption[]>([
        { id: "femenino", label: "Femenino", checked: false },
        { id: "masculino", label: "Masculino", checked: false },
        { id: "no-binario", label: "No binario", checked: false },
    ]);

    const handleCheckboxChange = (id: string) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, checked: !option.checked } : option
        ));
    };

    return (
        <FiltroCard title="Género" forceRecalculate={forceRecalculate}>
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

export { FiltroGenero }