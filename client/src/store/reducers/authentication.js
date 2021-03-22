import { updateObject } from '../utility';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loginLoading: false,
  authenticated: false,
  accountData:{},
  checkLoginLoading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHECKLOGIN_START: 
        return updateObject(state, {checkLoginLoading:true});
    case actionTypes.LOGIN_START: 
        return updateObject(state,{loginLoading:true});
    case actionTypes.LOGIN_SUCCESS:
        return updateObject(state,{checkLoginLoading:false, loginLoading:false, accountData: action.accountData, authenticated:true});
    case actionTypes.LOGIN_FAILED:
        return updateObject(state,{checkLoginLoading:false, loginLoading:false, authenticated: false});
    default:
      return state;
  }
};

export default reducer;
