
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import routes from './routes';
import {renderRoutes} from 'react-router-config';

const App = props => {
  return (
    <BrowserRouter>
      <div>{renderRoutes(routes)}</div>
    </BrowserRouter>
  )
}

export default App;
