importScripts("https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js");


firebase.initializeApp({
    apiKey: "AIzaSyAhttqEqj4h_IsXOHA1XbdKM9BIUHQIPGo",
    authDomain: "chat-poc-1.firebaseapp.com",
    databaseURL: "https://chat-poc-1.firebaseio.com",
    projectId: "chat-poc-1",
    storageBucket: "chat-poc-1.appspot.com",
    messagingSenderId: "599987334290",
    appId: "1:599987334290:web:fed8f8ad934f2da60b4a4b",
    measurementId: "G-BQMX2NXFY6"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
    const promiseChain = clients
        .matchAll({
            type: "window",
            includeUncontrolled: true
        })
        .then(windowClients => {
            for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage(payload);
            }
        })
        .then(() => {
            return registration.showNotification("my notification title");
        });
    return promiseChain;
});

self.addEventListener('notificationclick', event => {
    return event;
});