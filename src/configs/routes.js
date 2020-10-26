import { URL_MAP } from '../constants/urls';
import { generatePath } from 'react-router';

const { BASE_URL, LOGIN, SIGN_IN, CHAT_ROOM } = URL_MAP;

export const buildRoute = (...args) => {
    return (
        args.reduce((prevRoute, item) => {
            return prevRoute + (typeof item === 'number' || item.indexOf('(') === -1 ? `/${item}` : item);
        }, '')
    );
};

export const applyRouteParams = (path, params) => {
    return generatePath(path, params);
};

const ROUTES = {
    ROOT: `/${BASE_URL}`,
    LOGIN: buildRoute(LOGIN),
    SIGN_IN: buildRoute(SIGN_IN),
    CHAT_ROOM: buildRoute(CHAT_ROOM)
}

export default ROUTES;