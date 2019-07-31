import { combineReducers } from 'redux'
import authReducer from './authReducer'
import helpscoutReducer from './helpscoutReducer'
import dbReducer from './dbReducer'
import { connectRouter } from 'connected-react-router'

export default (history) => combineReducers({
  router: connectRouter(history),
  auth: authReducer,
  helpscout: helpscoutReducer,
  dbConnection: dbReducer
})