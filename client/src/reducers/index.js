import { combineReducers } from 'redux'
import authReducer from './authReducer'
import helpscoutReducer from './helpscoutReducer'
import dbReducer from './dbReducer'

export default combineReducers({
  auth: authReducer,
  helpscout: helpscoutReducer,
  dbConnection: dbReducer
})