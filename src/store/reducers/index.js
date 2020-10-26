import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";


import rSession from "./reducer-session";
import rLoading from "./reducer-loading";
import rUser from './reducer-user';

export const RootReducer = (history) => (
    combineReducers({
        router: connectRouter(history),
        rSession,
        rLoading,
        rUser
    })
);
