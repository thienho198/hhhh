
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import routes from './routes';
import {renderRoutes} from 'react-router-config';
import { Provider } from 'react-redux';
import {store} from './store';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = props => {
  return (
    <Provider store={store}>
      <BrowserRouter>
          <div>{renderRoutes(routes)}</div>
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
      </BrowserRouter>
    </Provider>
  )
}

export default App;
