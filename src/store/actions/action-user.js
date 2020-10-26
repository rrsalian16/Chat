import { ActionLoadingUpdate } from './action-loading';
import { config } from '../../configs/index';
import ROUTES from '../../configs/routes';
import { ActionRouteNavigate } from "./action-route";
import { ActionSessionStart, ActionSessionClear } from './action-session';
import { USER_ACTIONS } from '../actions-names/users';

import { storage } from "../../index";

const firebase = require("firebase/app");
require("firebase/firestore")
require("firebase/auth")
require("firebase/storage")


export function ActionLogin(params) {
    return (dispatch) => {
        dispatch(ActionLoadingUpdate('login', true));
        firebase.auth()
            .signInWithEmailAndPassword(params.email,params.password)
            //.signInWithEmailAndPassword(params.email, params.password)
            .then((authRes) => {
                dispatch(ActionSessionStart(authRes));
                dispatch(ActionRouteNavigate(ROUTES.CHAT))
            }, error => {
                console.log(error);
            }).finally(() => dispatch(ActionLoadingUpdate('login', false)));
    };
}

export function ActionSignup(params) {
    return (dispatch) => {
        dispatch(ActionLoadingUpdate('signup', true));

        firebase.auth()
            .createUserWithEmailAndPassword(params.email, params.password)
            .then(
                authRes => {
                    const userObj = {
                        id: authRes.user.uid,
                        email: authRes.user.email
                    }
                    dispatch(ActionSessionStart(authRes))
                    firebase.firestore()
                        .collection('users')
                        .doc(params.email).set(userObj)
                        .then(() => {
                            dispatch(ActionRouteNavigate(ROUTES.CHAT))
                        }, dbError => {
                            console.log(dbError);
                        })
                }, authError => {
                    console.log(authError);
                }
            ).finally(() => dispatch(ActionLoadingUpdate('signup', false)));

    }
}

export function ActionLogout() {
    return (dispatch) => {
        firebase.auth().signOut();
        dispatch({ type: USER_ACTIONS.LOGOUT });
        dispatch(ActionSessionClear());
        dispatch(ActionSessionUser());
        dispatch(ActionRouteNavigate(ROUTES.LOGIN));
    }
}

export function ActionGetUserList() {
    return (dispatch) => {
        dispatch(ActionLoadingUpdate('getUser', true));
        firebase.firestore().collection('users').get()
            .then(res => {
                var response = [];
                res.forEach(doc => {
                    response.push({ "id": doc.data().id, "email": doc.data().email });
                    //console.log(doc.data().id, " => ", doc.data().email);
                });
                const data = {
                    userList: response
                }
                dispatch({ type: USER_ACTIONS.GET_USER, data: data })
            }, error => {
                console.log(error);
            }).finally(() => dispatch(ActionLoadingUpdate('getUser', false)));
    };
}

export function ActionChatWith(param) {
    return (dispatch) => {
        const data = {
            chatWith: param
        }
        dispatch({ type: USER_ACTIONS.CHAT_WITH, data: data });
        dispatch(ActionRouteNavigate(ROUTES.CHAT_ROOM));
    }
}

export function ActionGetChats(param) {
    return (dispatch) => {
        dispatch(ActionLoadingUpdate('getChat', true));
        firebase.firestore().collection('chats')
            .where('users', 'array-contains', param)
            .onSnapshot(async res => {
                const chats = res.docs.map(doc => doc.data());
                const data = { messages: chats }
                await dispatch({ type: USER_ACTIONS.MESSAGES, data: data })
            })
        dispatch(ActionLoadingUpdate('getChat', false));
    }
}

export function ActionSendMessage(msg, to, from) {
    return (dispatch) => {
        const docKey = [to, from].sort().join(":");
        firebase.firestore().collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: from,
                    message: msg,
                    img: null,
                    time: Date.now()
                }),
                readStatus: false,
            })

    }
}
export function ActionImageMessage(url, to, from) {
    return (dispatch) => {
        const docKey = [to, from].sort().join(":");
        firebase.firestore().collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: from,
                    message: null,
                    img: url,
                    time: Date.now()
                }),
                readStatus: false,
            })

    }
}

export function ActionCreateNewChat(user1, user2) {
    return (dispatch) => {
        const docKey = [user1, user2].sort().join(":");
        firebase.firestore().collection('chats')
            .doc(docKey).set({
                users: [user1, user2],
                readStatus: false,
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: user2,
                    message: "Hi",
                    time: Date.now()
                }),
            })
    }
}

export function ActionFileMessage(file, to, from, uid) {
    return (dispatch) => {
        let bucketName = "images";
        let uploadTask = firebase.storage().ref(`${bucketName}/${uid}/${file.name}`).put(file)
        uploadTask.on('state_changed',
            (snapShot) => {
                //console.log("snapshot", snapShot)
            }, (err) => {
                console.log(err)
            }, () => {
                storage.ref('images').child(uid).child(file.name).getDownloadURL()
                    .then(fireBaseUrl => {
                        //console.log(fireBaseUrl);
                        dispatch(ActionImageMessage(fireBaseUrl, to, from));
                    })
            })
    };
}

export function ActionCreateGroup(name, user, uid) {
    return (dispatch) => {
        const docKey = `${name}@${uid}`;
        firebase.firestore().collection('chats')
            .doc(docKey).set({
                users: [user],
                groupName: docKey,
                readStatus: false,
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: user,
                    message: "Hi",
                    time: Date.now()
                }),
            })
    }
}

export function ActionGroupMessage(msg, docKey, from) {
    return (dispatch) => {
        firebase.firestore().collection('chats')
            .doc(docKey)
            .update({
                readStatus: false,
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: from,
                    message: msg,
                    time: Date.now()
                }),
            })

    }
}

export function ActionGroupImageMessage(url, docKey, from) {
    return (dispatch) => {
        firebase.firestore().collection("chats")
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: from,
                    message: null,
                    img: url,
                    time: Date.now()
                }),
                readStatus: false,
            })

    }
}

export function ActionGroupUpload(file, from, group, uid) {
    return (dispatch) => {
        let bucketName = "images";
        let uploadTask = firebase.storage().ref(`${bucketName}/${group}/${uid}/${file.name}`).put(file)
        uploadTask.on('state_changed',
            (snapShot) => {
                //console.log("snapshot", snapShot)
            }, (err) => {
                console.log(err)
            }, () => {
                storage.ref('images').child(group).child(uid).child(file.name).getDownloadURL()
                    .then(fireBaseUrl => {
                        //console.log(fireBaseUrl);
                        dispatch(ActionGroupImageMessage(fireBaseUrl, group, from));
                    })
            })
    };
}

export function ActionAddUserToGroup(docKey, user) {
    return (dispatch) => {
        firebase.firestore().collection('chats')
            .doc(docKey).update({
                users: firebase.firestore.FieldValue.arrayUnion(user),

            })
    }
}

export function ActionRemoveUserFromGroup(docKey, user) {
    return (dispatch) => {
        firebase.firestore().collection('chats')
            .doc(docKey).update({
                users: firebase.firestore.FieldValue.arrayRemove(user),

            })
    }
}

export function ActionClearGruopChat(docKey) {
    return (dispatch) => {
        firebase.firestore().collection('chats')
            .doc(docKey).update({
                messages: null,
            })
    }
}

export function ActionClearIndividualChat(user1, user2) {
    return (dispatch) => {
        firebase.firestore().collection('chats')
            .where('users', 'in', [[user2, user1], [user1, user2]])
            .get()
            .then(res => {
                var doc = res.docs[0];
                doc.ref.update({
                    messages: null,
                })
            })
    }
}

export function ActionSessionUser() {

    return {
        type: USER_ACTIONS.CLEAR,
    }
}
