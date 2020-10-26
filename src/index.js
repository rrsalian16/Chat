import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import { store, persistedStore, history } from './store/store';
import Routes from './Routes';

const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/messaging")

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
});

const messaging = firebase.messaging();
messaging.requestPermission()
    .then(() => {
        console.log("Have Permission");
        return messaging.getToken();
    })
    .then((token) => {
        console.log(token);
    })
    .catch((err) => {
        console.log("Error occurred", err);
    })

messaging.onMessage(function (payload) {
    //console.log(payload);
});

messaging.usePublicVapidKey(
    // Project Settings => Cloud Messaging => Web Push certificates
    "BEU3DNNLyFpS42qHYX9omohVJX3tghytoRYER4egkjbSIkV5dxU1CNeHEJVwJ4TZkyeB599d38MMM1685QqDHPo"
);

const storage = firebase.storage();
export { messaging, storage, firebase as default }

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistedStore}>
            <ConnectedRouter history={history}>
                <Routes history={history} store={store} />
            </ConnectedRouter>
        </PersistGate>
    </Provider>,
    document.getElementById('root'),
);