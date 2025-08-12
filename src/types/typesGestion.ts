export interface Zona {
    id_zanalista: number;
    nombre_zanalista: string;
}

export interface Departamento {
    id_departamento: number;
    nombre_departamento: string;
    pais: number;
};

export interface Municipio {
    id_municipio: number;
    nombre_municipio: string;
    departamento: number;
};

export interface DepartamentoResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Departamento[];
};

export interface MunicipioResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Municipio[];
};