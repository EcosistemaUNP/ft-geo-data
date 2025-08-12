import L from 'leaflet';

interface FetchBoundsParams {
    id: number | null;
    typeName: string;
    map: L.Map;
    filterField: string;
    resetViewCoords?: [number, number];
    resetViewZoom?: number;
    isFirstLoad?: boolean;
};

interface FetchFeatureInfoParams {
    latlng: L.LatLng;
    typeName: string;
    map: L.Map;
};

interface SetCursorOnFeatureHoverParams {
    latlng: L.LatLng;
    typeName: string;
    map: L.Map;
};

const fetchBounds = async ({ id, typeName, map, filterField, isFirstLoad = false }: FetchBoundsParams) => {

    const baseUrl = `${import.meta.env.VITE_API_EI_GEO}/sesp/ows?service=WFS&version=1.1.0&request=GetFeature&outputFormat=application/json`;

    const nativeBounds = new L.LatLngBounds(
        [-4.229406465999944, -81.7356205559999], // Min Y, Min X
        [13.394727762000059, -66.84721542699992] // Max Y, Max X
    );

    if (isFirstLoad || id === 0) {
        map.fitBounds(nativeBounds);
        return;
    }

    const url = id !== null && id !== 0
        ? `${baseUrl}&typeName=${typeName}&CQL_FILTER=${filterField}=${id}`
        : `${baseUrl}&typeName=${typeName}`;

    try {
        const response = await fetch(url, { mode: 'cors' });
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            let coordinates: [number, number][] = [];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.features.forEach((feature: any) => {
                if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
                    const coords = feature.geometry.type === 'Polygon'
                        ? feature.geometry.coordinates[0]
                        : feature.geometry.coordinates.flat(2);

                    coordinates = coordinates.concat(coords.map((coord: [number, number]) => [coord[1], coord[0]]));
                } else {
                    console.log('Tipo de geometría no soportado:', feature.geometry.type);
                }
            });

            if (coordinates.length > 0) {
                const bounds = new L.LatLngBounds(coordinates);
                map.flyToBounds(bounds);
            } else {
                // Si no hay coordenadas válidas, restablecer la vista del mapa
                map.fitBounds(nativeBounds);
            }
        } else {
            // Si no hay features, restablecer la vista del mapa
            map.fitBounds(nativeBounds);
        }
    } catch (error) {
        console.error('Error fetching bounds:', error);
        map.fitBounds(nativeBounds);
    }
};

const fetchFeatureInfo = async ({ latlng, typeName, map }: FetchFeatureInfoParams) => {
    const { lat, lng } = latlng;
    const bbox = [lng - 0.001, lat - 0.001, lng + 0.001, lat + 0.001].join(',');

    try {
        const response = await fetch(import.meta.env.VITE_API_EI_GEO + `/sesp/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json&bbox=${bbox},EPSG:4326`, { mode: 'cors' });
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            const popupContent = `<table>
                <tr><th>Municipio:</th><td style="padding-left: 10px">${feature.properties.nombre_municipio}</td></tr>
                <tr><th>Solicitudes:</th><td style="padding-left: 10px">${feature.properties.Solicitudes}</td></tr>
            </table>`;

            L.popup()
                .setLatLng(latlng)
                .setContent(popupContent)
                .openOn(map);
        }
    } catch (error) {
        console.error('Error fetching feature information:', error);
    }
};

const setCursorOnFeatureHover = ({ latlng, typeName, map }: SetCursorOnFeatureHoverParams) => {
    const { lat, lng } = latlng;
    const bbox = [lng - 0.001, lat - 0.001, lng + 0.001, lat + 0.001].join(',');

    fetch(import.meta.env.VITE_API_EI_GEO + `/sesp/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json&bbox=${bbox},EPSG:4326`, { mode: 'cors' })
        .then(response => response.json())
        .then(data => {
            if (data.features && data.features.length > 0) {
                map.getContainer().style.cursor = 'pointer';
            } else {
                map.getContainer().style.cursor = '';
            }
        })
        .catch(error => console.error('Error fetching feature information:', error));
};


const checkConnection = async (): Promise<boolean> => {
    try {
        const response = await fetch(import.meta.env.VITE_API_EI_GEO + '/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return true;
    } catch {
        return false;
    }
};

export { fetchBounds, fetchFeatureInfo, setCursorOnFeatureHover, checkConnection };