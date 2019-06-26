import * as actionTypes from '../actions/types'

export default function(state = {}, action) {
    const { mailboxes, conversations, threads, dbResponse } = action
    
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
        case actionTypes.GET_THREADS :
            return {
                ...state,
                threads
        }
      case actionTypes.POST_THREADS:
        return {
          ...state,
          dbResponse
        }
        default:
            return state
    }
}

