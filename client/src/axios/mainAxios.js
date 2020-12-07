import axios from 'axios';
import authRefreshAxios from './refreshAxios';
import _ from 'lodash';
import {AUTH} from 'config/apis';

const instance = axios.create({})
const myStorage = window.localStorage

instance.interceptors.request.use((config) => {
    config.headers = {
        Authorization: `Bearer ${myStorage.getItem('access_token')}`
    };
    return config;
});

const refresh = async (dataToken, resolve, reject, error) => {
	try {
		const { data } = await authRefreshAxios.get(AUTH.refreshToken + dataToken.refresh_token );

        myStorage.setItem('access_token', _.get(data,'data.access_token'));
        myStorage.setItem('refresh_token', _.get(data,'data.refresh_token'));

		const response = await authRefreshAxios.request(error.config);

		resolve(response);
	} catch (err) {
		reject(err);
	}
};

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return new Promise((resolve, reject) => {
            if(error.config.url === AUTH.login){
                reject(error)
            }
            else if (_.get(error,'response.status') === 401 && error.config && !error.config.__isRetryRequest){
                const dataToken = {
                    refresh_token: myStorage.getItem('refresh_token')
                }
                refresh(dataToken, resolve, reject, error)
            }
            else{
                reject(error)
            }
		});
	}
);

export default instance;