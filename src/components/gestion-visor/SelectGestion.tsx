import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { getDepartamento, getMunicipio } from "../../services";
import type { Departamento, Municipio } from "../../types";
import Select from "react-select";

interface Props {
    onVigenciaChange: (id_vigencia: number) => void;
    onZonaChange: (id_zona: number) => void;
    onDptoChange: (id_departamento: number) => void;
    onMpioChange: (id_municipio: number) => void;
}


// Eliminar en su momento...
const vigenciaOptions = [
    { value: "0", label: "Vigencia..." },
    { value: "1", label: "2017" },
    { value: "2", label: "2018" },
    { value: "3", label: "2019" },
    { value: "4", label: "2020" },
    { value: "5", label: "2021" },
    { value: "6", label: "2022" },
    { value: "7", label: "2023" },
    { value: "8", label: "2024" },
    { value: "9", label: "2025" }
];

const zonaOptions = [
    { value: "0", label: "Zona..." },
    { value: "1", label: "Centro" },
    { value: "2", label: "Suroccidente" },
    { value: "3", label: "Oriente" },
    { value: "4", label: "Noroccidente" },
    { value: "5", label: "Caribe" },
    { value: "6", label: "Sur" },
    { value: "7", label: "Nororiente" }
];

const SelectGestion: React.FC<Props> = ({ onVigenciaChange, onZonaChange, onDptoChange, onMpioChange }) => {

    // const dataAnalista = useRef<Analista[]>([]);
    const [departamento, setDepartamento] = useState<Departamento[]>([]);
    const [municipio, setMunicipio] = useState<Municipio[]>([]);

    const [formState, setFormState] = useState({
        vigencia: "0",
        zona: "0",
        departamento: "0",
        municipio: "0",
    });

    const [errors, setErrors] = useState({
        vigencia: false,
        zona: false,
        departamento: false,
        municipio: false,
    });

    const handleInputChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
            | { target: { name: string; value: string } }
    ) => {
        const { name, value } = e.target;

        // 1) Actualiza estado y resetea niveles inferiores
        setFormState((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "vigencia" && {
                zona: "0",
                departamento: "0",
                municipio: "0"
            }),
            ...(name === "zona" && { departamento: "0", municipio: "0" }),
            ...(name === "departamento" && { municipio: "0" })
        }));

        // 2) Limpia error si existía
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }

        // 3) Lógica de negocio por campo
        switch (name) {
            case "vigencia":
                onVigenciaChange(Number(value));
                // al cambiar vigencia, borramos municipios y recargamos departamentos
                setMunicipio([]);
                getDepartamento()
                    .then((d) => setDepartamento(d))
                    .catch(() => setDepartamento([]));
                break;

            case "zona":
                onZonaChange(Number(value));
                // al cambiar zona, borramos municipios y recargamos departamentos
                setMunicipio([]);
                getDepartamento()
                    .then((d) => setDepartamento(d))
                    .catch(() => setDepartamento([]));
                break;

            case "departamento":
                onDptoChange(Number(value));
                // al cambiar dpto, borramos municipios y recargamos municipios
                if (value === "0") {
                    setMunicipio([]);
                } else {
                    getMunicipio(Number(value))
                        .then((m) => setMunicipio(m))
                        .catch(() => setMunicipio([]));
                }
                break;

            case "municipio":
                onMpioChange(Number(value));
                break;
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const fetchedData = await fetchListadoAnalistas();
    //             dataAnalista.current = fetchedData;
    //         } catch (error) {
    //             console.error("Error fetching analistas:", error);
    //             dataAnalista.current = [];
    //         }
    //     };
    //     fetchData();
    // }, []);

    useEffect(() => {
        getDepartamento()
            .then((data) => setDepartamento(data))
            .catch((error) => {
                console.error("Error fetching departamentos:", error);
                setDepartamento([]);
            });
    }, []);

    const handleSelectChange = (fieldName: string) =>
        (newOption: { value: string; label: string } | null) => {
            handleInputChange({
                target: { name: fieldName, value: newOption?.value || "0" }
            });
        };

    const departamentoOptions = React.useMemo(
        () => [
            { value: "0", label: "Departamento..." },
            ...departamento.map(d => ({
                value: d.id_departamento.toString(),
                label: d.nombre_departamento
            }))
        ],
        [departamento]
    );

    const municipioOptions = React.useMemo(
        () => [
            { value: "0", label: "Municipio..." },
            ...municipio.map(d => ({
                value: d.id_municipio.toString(),
                label: d.nombre_municipio
            }))
        ],
        [municipio]
    );

    return (
        <Row className="select-zona-registros border rounded mb-2 mx-0 pe-2 ps-2">
            <Col md={2} className="pe-0 ps-0 py-3">
                <Select
                    name="vigencia"
                    value={
                        vigenciaOptions.find((o) => o.value === formState.vigencia) || null
                    }
                    onChange={handleSelectChange("vigencia")}
                    options={vigenciaOptions}
                    classNamePrefix="select"
                    placeholder="Vigencia..."
                />
            </Col>

            {/* Zonas */}
            <Col md={3} className="pe-0 py-3">
                <Select
                    name="zona"
                    value={zonaOptions.find((o) => o.value === formState.zona) || null}
                    onChange={handleSelectChange("zona")}
                    options={zonaOptions}
                    classNamePrefix="select"
                    placeholder="Zona..."
                />
            </Col>

            <Col md={3} className="pe-0 py-3">
                <Select<{ value: string; label: string }>
                    name="departamento"
                    options={departamentoOptions}
                    value={
                        departamentoOptions.find(opt => opt.value === formState.departamento) ||
                        departamentoOptions[0]
                    }
                    onChange={opt =>
                        handleInputChange({
                            target: {
                                name: "departamento",
                                value: opt?.value || "0"
                            }
                        })
                    }
                    classNamePrefix="select"
                    className={errors.departamento ? "is-invalid" : ""}
                    styles={{
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 1000,
                        })
                    }}
                />
            </Col>

            <Col md={4} className="pe-0 py-3">
                <Select<{ value: string; label: string }>
                    name="municipio"
                    options={municipioOptions}
                    value={
                        municipioOptions.find(opt => opt.value === formState.municipio) ||
                        municipioOptions[0]
                    }
                    onChange={opt =>
                        handleInputChange({
                            target: {
                                name: "municipio",
                                value: opt?.value || "0"
                            }
                        })
                    }
                    classNamePrefix="select"
                    className={errors.municipio ? "is-invalid" : ""}
                    styles={{
                        menu: (provided) => ({
                            ...provided,
                            zIndex: 1000,
                        })
                    }}
                />
            </Col>
        </Row>
    );
};

export { SelectGestion };