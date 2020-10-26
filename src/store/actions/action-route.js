import { push, goBack, goForward } from 'connected-react-router';


export function ActionRouteNavigate(location, obj) {
    if (obj !== undefined)
        return push(location, obj)
    return push(location);
}

export function ActionRouteNavigateR(location) {
    return {
        type: 'GO_TO_PAGE',
        url: location,
    };
}

export function ActionRouteGoBack() {
    return goBack();
}

export function ActionRouteGoForward() {
    return goForward();
}
