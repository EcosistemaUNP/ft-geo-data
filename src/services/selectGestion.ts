import type { DepartamentoResponse, Municipio, MunicipioResponse } from '../types';

async function getZona() {

    // const url = import.meta.env.VITE_API_EI_SESP + 'graerr/zona-analista';

    // try {
    //     const response = await fetch(url);
    //     if (!response.ok) {
    //         throw new Error(`Error HTTP: ${response.status}`);
    //     }
    //     const data = await response.json();
    //     return data; 
    // } catch (error) {
    //     console.error("Error al obtener las zonas:", error);
    //     return [];
    // }

    return null; // !!! Eliminar una vez se cree el modelo...

}

async function getDepartamento() {
    const url = import.meta.env.VITE_API_EI_SESP + 'sistema/departamento/?pais=1';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data: DepartamentoResponse = await response.json();
        return data.results;  // Retornamos solo el arreglo de departamentos
    } catch (error) {
        console.error("Error al obtener los departamentos:", error);
        return [];
    }
}

async function getMunicipio(departamentoId: number): Promise<Municipio[]> {

    const url = import.meta.env.VITE_API_EI_SESP + `sistema/municipio/?departamento=${departamentoId}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data: MunicipioResponse = await response.json();

        return data.results;

    } catch (error) {
        console.error("Error al obtener los municipios:", error);
        return [];
    }

}

export { getDepartamento, getMunicipio, getZona };