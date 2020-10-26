import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory } from 'history';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';


import ConfigStorage from '../configs/index';
import { RootReducer } from '../store/reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createBrowserHistory({
    basename: ConfigStorage().ROUTES.ROOT,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['rSession', 'rUser']
}


const persistedReducer = persistReducer(persistConfig, RootReducer(history));

const logger = createLogger({
    collapsed: true,
});

const middlewares = [
    thunk,
    routerMiddleware(history),
];

if (process.env.LOGGER) {
    middlewares.push(logger);
}

export const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middlewares))
)

export const getState = () => store.getState();

export const getHeader = () => {
    const storeData = getState();
    const { rSession } = storeData;

    return {
        userId: rSession.viewModel !== undefined ? rSession.viewModel.userId : "",
        accessToken: "AccessBearer " + (rSession.viewModel !== undefined ? rSession.token : "")
    }
}

export const persistedStore = persistStore(store);