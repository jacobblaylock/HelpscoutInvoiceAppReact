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
    return function(dispatch) {
        axios.get('/mailboxes', authHeader)
            .then(res => {
                dispatch({ type: actionTypes.GET_MAILBOXES, mailboxes: res.data._embedded.mailboxes})
            })
    }
}

export const listConversations = (authHeader, params) => {
    console.log(JSON.stringify(params))
    return function(dispatch) {
        axios.get('/conversations', { ...authHeader, params })
            .then(res => {
                console.log(JSON.stringify(res))
                dispatch({ type: actionTypes.LIST_CONVERSATIONS, conversations: res.data._embedded.conversations.map(convo => {
                    return {
                        id: convo.id,
                        number: convo.number,
                        status: convo.status,
                        assignee: convo.assignee,
                        customFields: convo.customFields,
                        subject: convo.subject,
                        preview: convo.preview
                    }
                })})
            })
    }
}