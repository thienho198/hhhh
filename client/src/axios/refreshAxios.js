import axios from 'axios';

const myStorage = window.localStorage;

const instance = axios.create({});

instance.interceptors.request.use((config) => {
    config.headers = {
        Authorization: `Bearer ${myStorage.getItem('access_token')}`
    };
	return config;
});

export default instance;