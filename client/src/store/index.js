import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import defaultReducer from './reducers/defaultReducer';
import authenticationReducer from './reducers/authentication';

import * as authenActions from './actions/authenticate';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  default: defaultReducer,
  authentication: authenticationReducer
});

export const store = createStore(rootReducer,{},composeEnhancers(applyMiddleware(thunk)));

(localStorage.getItem('access_token') || localStorage.getItem('refresh_token')) && store.dispatch(authenActions.checkLogin())