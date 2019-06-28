import * as actionTypes from '../actions/types'

export default function (state = { message: undefined, connected: false }, action) {
  const { dbConnection, testing } = action

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
    default:
      return state
  }
}

