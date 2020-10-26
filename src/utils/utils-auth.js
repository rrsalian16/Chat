import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'

import ROUTES from '../configs/routes';

const locationHelper = locationHelperBuilder({})

export const auth = connectedRouterRedirect({
    allowRedirectBack: true,
    authenticatedSelector: state => {
        return !!state.rSession['user']
    },
    redirectPath: (state, ownProps) => {
        if (ownProps.location.pathname.indexOf('?') === -1) {
            return ROUTES.LOGIN
        }
        return locationHelper.getRedirectQueryParam(ownProps) || ROUTES.LOGIN
    },
    wrapperDisplayName: 'UserIsAuthenticated'
})

export const notAuth = connectedRouterRedirect({
    allowRedirectBack: false,
    authenticatedSelector: state => !state.rSession['user'],
    redirectPath: (state, ownProps) => {
        if (ownProps.location.pathname.indexOf('?') === -1) {
            return ROUTES.ROOT
        }
        return locationHelper.getRedirectQueryParam(ownProps) || ROUTES.ROOT
    },
    wrapperDisplayName: 'UserIsNotAuthenticated'
})