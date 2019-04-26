import * as actionTypes from '../actions/types'

export default function(state = {}, action) {
    const { helpscoutHeader } = action
    
    switch ( action.type ) {
        case actionTypes.GET_AUTH :
            return helpscoutHeader
        default:
            return state
    }
}

