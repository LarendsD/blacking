import React from 'react';
import Welcome from './components/welcome';
import { createBrowserRouter } from 'react-router-dom';

export default createBrowserRouter([
  {
    path: '/',
    element: <Welcome />,
  },
]);
