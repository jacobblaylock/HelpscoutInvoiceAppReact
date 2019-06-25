import * as actionTypes from '../actions/types'

export default function (state = {message: undefined, connected: false}, action) {
  const { dbConnection } = action

  switch (action.type) {
    case actionTypes.DB_CONNECTION:
      return dbConnection
    default:
      return state
  }
}

