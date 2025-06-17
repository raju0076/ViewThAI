import React, { useState } from 'react';
import MapPage from './components/MapPage';
import LoginPage from './components/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to true for demo

  return (
    <>
      {isAuthenticated ? (
        <MapPage setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <LoginPage setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
}

export default App;