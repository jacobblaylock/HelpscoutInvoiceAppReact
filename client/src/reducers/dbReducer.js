import * as actionTypes from '../actions/types'

export default function (state = { message: undefined, connected: false }, action) {
  const { dbConnection, testing, loading } = action

  switch (action.type) {
    case actionTypes.DB_CONNECTION:
      return dbConnection
    case actionTypes.DB_CONNECTION_TEST:
      return {
        dbConnection: {
          ...dbConnection,
          message: ''
        },
        testing
      }
    case actionTypes.DB_LOADING_TICKETS:
      return {
        ...state,
        loading
      }
    default:
      return state
  }
}

