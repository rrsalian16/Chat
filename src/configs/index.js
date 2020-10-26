import ROUTES from './routes';
import API_MAP from './url-api';

//export const API_URL = 'http://127.0.0.1:8080/tele-medicine';
export const API_URL = 'http://139.59.43.65:8080/connectit/';

export const API_SETTINGS = {
    API_URL,
};

export const config = {
    ROUTES,
    API_SETTINGS,
    API_MAP,
    API_URL,
};

export default function ConfigStorage() {
    return config;
}
