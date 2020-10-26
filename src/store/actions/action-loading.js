import { LOADING_ACTIONS } from '../actions-names/loading';

export function ActionLoadingUpdate(ns, payload) {
    const data = {};
    data[ns] = payload;

    return {
        type: LOADING_ACTIONS.LOADING_UPDATE,
        data,
    };
}