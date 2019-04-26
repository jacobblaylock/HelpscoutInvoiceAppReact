import  { combineReducers } from 'redux'
import authReducer from './authReducer'
import helpscoutReducer from './helpscoutReducer'

export default combineReducers({
    auth: authReducer,
    helpscout: helpscoutReducer
})