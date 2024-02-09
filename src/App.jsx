import React, { useEffect, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Navigate } from 'react-router-dom';
import ApplicationRoutes from './routes/ApplicationRoutes';
import ErrorPage from './components/Error';
import SuspenseFallback from './components/Suspense';

function App() {
  useEffect(() => {
    <Navigate to="buy_tug_points" />;
  }, []);

  return (
    <div className="App">
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <BrowserRouter>
          <Suspense fallback={<SuspenseFallback />}>
            <ApplicationRoutes />
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
