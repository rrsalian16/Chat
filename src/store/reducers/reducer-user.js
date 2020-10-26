import ACTIONS from "../actions-names";

const { USER_ACTIONS } = ACTIONS;

export default (state = {}, action) => {
    switch (action.type) {
        case USER_ACTIONS.GET_USER:
            return {
                ...state,
                ...action.data
            };
        case USER_ACTIONS.LOGOUT:
            return state;
        case USER_ACTIONS.CHAT_WITH:
            return {
                ...state,
                ...action.data
            }
        case USER_ACTIONS.MESSAGES:
            return {
                ...state,
                ...action.data
            }
        case USER_ACTIONS.CLEAR:
            return {}
        default:
            return state;
    }
}