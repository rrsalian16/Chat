import React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import ROUTES from './configs/routes';
import { auth, notAuth } from './utils/utils-auth';

import Login from './pages/Login/Login';
import Signin from './pages/Signin/Signin';
import ChatRoom from './pages/ChatRoom/ChatRoom';

const Routes = () => {
    return (
        <Switch>
            <Route exact path={ROUTES.LOGIN} component={notAuth(Login)} />
            <Route exact path={ROUTES.SIGN_IN} component={notAuth(Signin)} />
            <Route exact path={ROUTES.CHAT_ROOM} component={auth(ChatRoom)} />
            <Redirect from={ROUTES.ROOT} to={ROUTES.CHAT_ROOM} />
        </Switch>
    );
};

Routes.propTypes = {};

export default Routes;