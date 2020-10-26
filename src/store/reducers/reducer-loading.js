import ACTIONS from "../actions-names";

const { LOADING_ACTIONS } = ACTIONS;

export default (state = {}, action) => {
    switch (action.type) {
        case LOADING_ACTIONS.LOADING_UPDATE:
            return {
                ...state,
                ...action.data
            };

        default:
            return state;
    }
}