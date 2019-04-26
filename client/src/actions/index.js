import axios from 'axios'
import * as actionTypes from './types'

export const getAuth = () => {
    return function(dispatch) {
        axios.get('api/accessToken')
            .then(res => {
                dispatch({ type: actionTypes.GET_AUTH, helpscoutHeader: res.data})
            })
    }
}

export const getMailboxes = (authHeader) => {
    console.log(authHeader)
    return function(dispatch) {
        axios.get('/mailboxes', authHeader)
            .then(res => {
                console.log(res)
                dispatch({ type: actionTypes.GET_MAILBOXES, mailboxes: res.data._embedded})
            })
    }
}