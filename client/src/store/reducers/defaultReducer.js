import { updateObject } from '../utility';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  sayHello: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.DEFAULT_REDUCER_HELLO:
      return updateObject(state, { sayHello: true });
    default:
      return state;
  }
};

export default reducer;
