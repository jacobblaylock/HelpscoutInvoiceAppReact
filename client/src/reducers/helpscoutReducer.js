import * as actionTypes from '../actions/types'

export default function(state = {}, action) {
    const { mailboxes } = action
    const { conversations } = action
    
    switch ( action.type ) {
        case actionTypes.GET_MAILBOXES :
            return {
                ...state,
                mailboxes
            }
        case actionTypes.LIST_CONVERSATIONS :
            return {
                ...state,
                conversations
            }
        default:
            return state
    }
}

