import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, WMSTileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { fetchBounds, fetchFeatureInfo, setCursorOnFeatureHover, checkConnection } from './MapFunciones';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'

interface Props {
    idVigencia?: number | null;
    idZona?: number | null;
    idDepartamento?: number | null;
    idMunicipio?: number | null;
}

// Función para obtener el año actual
const obtenerAnioActual = () => {
    return new Date().getFullYear();
};

// Componente unificado para manejar todas las capas
const ActiveMapLayer: React.FC<Props> = ({ idZona, idDepartamento, idMunicipio }) => {
    const map = useMap();
    const wmsLayerRef = useRef<L.TileLayer.WMS | null>(null);
    const previousLayerType = useRef<string>('');
    
    // Determinar el tipo de capa activa
    const getActiveLayerType = () => {
        if (idMunicipio != null && idMunicipio !== 0) return 'municipios';
        if (idDepartamento != null && idDepartamento !== 0) return 'departamentos';
        return 'zonas';
    };

    const currentLayerType = getActiveLayerType();

    useEffect(() => {
        // Limpiar capa anterior si cambió el tipo de capa
        if (previousLayerType.current && previousLayerType.current !== currentLayerType) {
            if (wmsLayerRef.current) {
                wmsLayerRef.current.setParams({ layers: '' });
                map.removeLayer(wmsLayerRef.current);
                wmsLayerRef.current = null;
            }
        }
        previousLayerType.current = currentLayerType;
    }, [currentLayerType, map]);

    // Obtener parámetros WMS según la capa activa
    const getWmsParams = React.useCallback(() => {
        switch (currentLayerType) {
            case 'municipios':
                return {
                    layers: 'sesp:solicitudes-municipios',
                    CQL_FILTER: `id_municipio=${idMunicipio}`
                };
            case 'departamentos':
                return {
                    layers: 'sesp:solicitudes-departamentos',
                    CQL_FILTER: idDepartamento ? `id_departamento=${idDepartamento}` : ''
                };
            default:
                return {
                    layers: 'sesp:solicitudes-zonas',
                    CQL_FILTER: idZona ? `id_zanalista=${idZona}` : ''
                };
        }
    }, [currentLayerType, idMunicipio, idDepartamento, idZona]);

    // Obtener información para el zoom
    const getBoundsParams = React.useCallback(() => {
        switch (currentLayerType) {
            case 'municipios':
                return {
                    typeName: 'sesp:solicitudes-municipios',
                    filterField: 'id_municipio',
                    id: idMunicipio
                };
            case 'departamentos':
                return {
                    typeName: 'sesp:solicitudes-departamentos',
                    filterField: 'id_departamento',
                    id: idDepartamento
                };
            default:
                return {
                    typeName: 'sesp:solicitudes-zonas',
                    filterField: 'id_zanalista',
                    id: idZona
                };
        }
    }, [currentLayerType, idMunicipio, idDepartamento, idZona]);

    useEffect(() => {
        if (!wmsLayerRef.current) return;

        const params = getWmsParams();
        wmsLayerRef.current.setParams(params);

        // Aplicar zoom solo si hay un ID válido
        const boundsParams = getBoundsParams();
        if (boundsParams.id) {
            fetchBounds({
                ...boundsParams,
                id: boundsParams.id ?? null,
                map: map
            }).catch((error) => {
                console.error('Error fetching bounds:', error);
                map.setView([4.63, -74.30], 6);
            });
        }
    }, [idZona, idDepartamento, idMunicipio, map, currentLayerType, getWmsParams, getBoundsParams]);

    // Manejador único de eventos
    const handleMapEvents = React.useCallback((e: L.LeafletMouseEvent) => {
        const typeName = currentLayerType === 'municipios'
            ? 'sesp:solicitudes-municipios'
            : currentLayerType === 'departamentos'
                ? 'sesp:solicitudes-departamentos'
                : 'sesp:solicitudes-zonas';

        if (e.type === 'click') {
            fetchFeatureInfo({ latlng: e.latlng, typeName, map });
        } else if (e.type === 'mousemove') {
            setCursorOnFeatureHover({ latlng: e.latlng, typeName, map });
        }
    }, [currentLayerType, map]);

    // Registrar eventos del mapa
    useEffect(() => {
        map.on('click', handleMapEvents);
        map.on('mousemove', handleMapEvents);
        map.on('mouseout', () => {
            map.getContainer().style.cursor = '';
        });

        return () => {
            map.off('click', handleMapEvents);
            map.off('mousemove', handleMapEvents);
            map.off('mouseout');
        };
    }, [map, currentLayerType, handleMapEvents]);

    return (
        <FeatureGroup>
            <WMSTileLayer
                ref={wmsLayerRef}
                url={import.meta.env.VITE_API_EI_GEO + "/sesp/wms"}
                layers="sesp:solicitudes-zonas"
                format="image/png"
                transparent={true}
                attribution=""
                version="1.1.1"
                crs={L.CRS.EPSG4326}
            />
        </FeatureGroup>
    );
};

// Mapa principal
const MapGestion: React.FC<Props> = ({ idDepartamento, idZona, idMunicipio }) => {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const anio = obtenerAnioActual();

    const atribucion_unp = `Subdirección Especializada de Seguridad y Protección (SESP) | ${anio}`;
    const carto_url = "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png";
    const osm_url = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
    const google_url = "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}";

    // Función para determinar el tipo de capa activa
    const getActiveLayerType = () => {
        if (idMunicipio != null && idMunicipio !== 0) return 'municipios';
        if (idDepartamento != null && idDepartamento !== 0) return 'departamentos';
        return 'zonas';
    };

    const activeLayerType = getActiveLayerType();

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            if (mapRef.current) {
                mapRef.current.invalidateSize();
            }
        });

        const container = mapContainerRef.current;
        if (container) {
            observer.observe(container);
        }

        return () => {
            if (container) {
                observer.unobserve(container);
            }
        };
    }, []);

    useEffect(() => {
        const fetchConnection = async () => {
            setError(!(await checkConnection()));
        };

        fetchConnection();
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && mapRef.current) {
            setTimeout(() => mapRef.current?.invalidateSize(), 100);
        }
    }, [isMounted, idZona, idDepartamento, idMunicipio]);

    if (error) {
        return (
            <div>
                <MapContainer
                    center={[4.250, -72.949]}
                    zoom={10}
                    scrollWheelZoom={true}
                    attributionControl={true}
                    className='map-container'
                >
                    <LayersControl position="topright" collapsed={true}>
                        <LayersControl.BaseLayer checked name="OpenStreetMap">
                            <TileLayer attribution={atribucion_unp} url={osm_url} />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                    <div className="map-error-message">
                        Error al tratar de cargar las entidades geográficas desde el servidor.
                    </div>
                </MapContainer>
            </div>
        );
    }

    return (
        <div ref={mapContainerRef} style={{ height: "600px", width: "100%" }}>
            <MapContainer
                center={[4.250, -72.949]}
                zoom={6}
                scrollWheelZoom={true}
                attributionControl={true}
                className='map-container'
                ref={mapRef}
                whenReady={() => mapRef.current?.invalidateSize()}
            >
                <LayersControl position="topright" collapsed={false}>
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer attribution={atribucion_unp} url={osm_url} />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Carto">
                        <TileLayer attribution={atribucion_unp} url={carto_url} />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="GoogleMaps">
                        <TileLayer attribution={atribucion_unp} url={google_url} />
                    </LayersControl.BaseLayer>

                    <LayersControl.Overlay checked name="Entidad seleccionada">
                        <FeatureGroup>
                            <ActiveMapLayer
                                key={activeLayerType}  // Clave única para forzar recreación
                                idZona={idZona}
                                idDepartamento={idDepartamento}
                                idMunicipio={idMunicipio}
                            />
                        </FeatureGroup>
                    </LayersControl.Overlay>
                </LayersControl>
            </MapContainer>
        </div>
    );
};

export { MapGestion };