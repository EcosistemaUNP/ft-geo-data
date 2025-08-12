import './App.css'
import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Animacion } from 'react-ecosistema-unp/ui';

const PageVisorData = lazy(() => import('./tabs/DataVisor'));

const FallbackLoader = () => (
  <div className='container-animacion'>
    <Animacion type='loading_cat' width={300} />
    <span className='text-animacion'>Se paciente, estamos terminando de preparar tu entorno de trabajo...</span>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<FallbackLoader />}>
            <PageVisorData />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App
