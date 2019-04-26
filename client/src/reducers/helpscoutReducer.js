import * as actionTypes from '../actions/types'

export default function(state = {}, action) {
    const { mailboxes } = action
    
    switch ( action.type ) {
        case actionTypes.GET_MAILBOXES :
            return mailboxes.mailboxes
        default:
            return state
    }
}

