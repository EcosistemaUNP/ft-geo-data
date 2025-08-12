import React from "react";
import { TabVentana, VentanaTabs } from "react-ecosistema-unp/shared";
import { lazy, Suspense } from 'react';

const DataGestion = lazy(() => import('../tabs/DataGestion'));
const DataVisor = lazy(() => import('./../tabs/DataVisor'));

const PageVisorData: React.FC = () => {
    return (
        <VentanaTabs>
            <TabVentana eventKey={'gestion'} title={'Gestión'}>
                <Suspense fallback={<></>}>
                    <DataGestion />
                </Suspense>
            </TabVentana>
            <TabVentana eventKey={'visor'} title={'Visor'}>
                <Suspense fallback={<></>}>
                    <DataVisor />
                </Suspense>
            </TabVentana>
        </VentanaTabs>
    )
}

export default PageVisorData