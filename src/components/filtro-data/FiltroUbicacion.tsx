import React, { useState, useEffect } from "react";
import FiltroCard from "../visor-ui/FiltroCard";
import { getDepartamento, getMunicipio } from "../../services";
import type { Departamento, Municipio } from "../../types";
import Select from "react-select";

const FiltroUbicacion: React.FC<{ forceRecalculate?: boolean }> = ({ forceRecalculate }) => {

    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [selectedDepartamento, setSelectedDepartamento] = useState<string>("0");
    const [selectedMunicipio, setSelectedMunicipio] = useState<string>("0");


    // Cargar departamentos al montar el componente
    useEffect(() => {
        const cargarDepartamentos = async () => {
            const deptos = await getDepartamento();
            setDepartamentos(deptos);
        };

        cargarDepartamentos();
    }, []);

    // Cargar municipios cuando cambia el departamento seleccionado
    useEffect(() => {
        const cargarMunicipios = async () => {
            if (selectedDepartamento !== "0") {
                const munis = await getMunicipio(Number(selectedDepartamento));
                setMunicipios(munis);
            } else {
                setMunicipios([]);
            }
        };

        cargarMunicipios();
    }, [selectedDepartamento]);

    const handleDepartamentoChange = (selectedOption: any) => {
        setSelectedDepartamento(selectedOption.value);
    };

    const handleMunicipioChange = (selectedOption: any) => {
        setSelectedMunicipio(selectedOption.value);
    };

    const departamentoOptions = [
        { value: "0", label: "Departamento..." },
        ...departamentos.map(d => ({
            value: d.id_departamento.toString(),
            label: d.nombre_departamento
        }))
    ];

    const municipioOptions = [
        { value: "0", label: "Municipio..." },
        ...municipios.map(m => ({
            value: m.id_municipio.toString(),
            label: m.nombre_municipio
        }))
    ];

    return (
        <FiltroCard title="Ubicación" forceRecalculate={forceRecalculate}>
            <div className="card-filtro-body">
                <label className="card-label">Departamento</label>
                <Select
                    name="departamento"
                    options={departamentoOptions}
                    value={departamentoOptions.find(opt => opt.value === selectedDepartamento)}
                    onChange={handleDepartamentoChange}
                    classNamePrefix="select"
                    styles={{
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 100,
                        })
                    }}
                />

                <label className="card-label">Municipio</label>
                <Select
                    name="municipio"
                    options={municipioOptions}
                    value={municipioOptions.find(opt => opt.value === selectedMunicipio)}
                    onChange={handleMunicipioChange}
                    classNamePrefix="select"
                    isDisabled={selectedDepartamento === "0"}
                />

                <label className="card-label">Zona</label>
                <select className="form-control" disabled>
                    <option value="">Seleccione una ubicación</option>
                </select>
            </div>
        </FiltroCard>
    );
};

export { FiltroUbicacion }