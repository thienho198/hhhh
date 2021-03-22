import * as actionTypes from './actionTypes';
import {ACCOUNT, AUTH} from '../../config/apis';
import {CLIENT_CREDENTIAL}  from '../../config/enum';
import axios from '../../axios/mainAxios';
import get from 'lodash/get';


const checkLoginStart = () =>{
    return {
        type: actionTypes.CHECKLOGIN_START
    }
}

const loginStart = () =>{
    return {
        type: actionTypes.LOGIN_START
    }
}

const loginSuccess = (accountData) =>{
    return {
        type: actionTypes.LOGIN_SUCCESS,
        accountData: accountData
    }
}
const loginFailure = () =>{
    return {
        type: actionTypes.LOGIN_FAILED
    }
}

export const login = (username, password, history) =>{
    return async dispatch =>{
        try{
            dispatch(loginStart());
            const body = {
                grant_type: 'password',
                username: username,
                password: password
            }
            const tokenResult = await axios.post(AUTH.obtainToken,body,{auth:{username:CLIENT_CREDENTIAL.CLIENT_ID, password:CLIENT_CREDENTIAL.CLIENT_SECRET}});
            const access_token = get(tokenResult,'data.data.accessToken');
            const refresh_token = get(tokenResult,'data.data.refreshToken');
            localStorage.setItem('access_token',access_token);
            localStorage.setItem('refresh_token',refresh_token);
            const account = await axios.get(ACCOUNT.getInfo);
            dispatch(loginSuccess(get(account,'data.data')));
            history.push('/');
        }
        catch(err){
            console.log(err);
            dispatch(loginFailure());
        }
    }
}

export const checkLogin = () => {
    return async dispatch=>{
        try{
            dispatch(checkLoginStart());
            const account = await axios.get(ACCOUNT.getInfo);
            dispatch(loginSuccess(get(account,'data.data')));
        }
        catch(err){
            console.log(err);
            dispatch(loginFailure());
        }
        
    }
};
