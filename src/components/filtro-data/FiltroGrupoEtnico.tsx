import React, { useState } from "react";
import FiltroCard from "../visor-ui/FiltroCard";

interface CheckboxOption {
    id: string;
    label: string;
    checked: boolean;
}

const FiltroGrupoEtnico: React.FC<{ forceRecalculate?: boolean }> = ({ forceRecalculate }) => {

    const [options, setOptions] = useState<CheckboxOption[]>([
        { id: "1", label: "Indígena", checked: false },
        { id: "2", label: "Negro/a", checked: false },
        { id: "3", label: "Afrocolombiano/a", checked: false },
        { id: "4", label: "Raizal", checked: false },
        { id: "5", label: "Palenquero/a", checked: false },
        { id: "6", label: "Rrom o Gitano/a", checked: false },

    ]);

    const handleCheckboxChange = (id: string) => {
        setOptions(options.map(option =>
            option.id === id ? { ...option, checked: !option.checked } : option
        ));
    };

    return (
        <FiltroCard title="Grupo étnico" forceRecalculate={forceRecalculate}>
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

export { FiltroGrupoEtnico }