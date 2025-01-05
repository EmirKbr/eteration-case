import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomNavbar from './components/CustomNavbar';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <Router>
      <CustomNavbar />
      <AppRoutes />
    </Router>
  );
};

export default App;
