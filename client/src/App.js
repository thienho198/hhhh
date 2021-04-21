
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import routes from './routes';
import {renderRoutes} from 'react-router-config';
import { Provider } from 'react-redux';
import {store} from './store';

const App = props => {
  return (
    <Provider store={store}>
      <BrowserRouter>
          <div>{renderRoutes(routes)}</div>
      </BrowserRouter>
    </Provider>
  )
}

export default App;
