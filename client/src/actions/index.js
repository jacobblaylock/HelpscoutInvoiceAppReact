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
                console.log(res)
                dispatch({ type: actionTypes.GET_MAILBOXES, mailboxes: res.data._embedded.mailboxes})
            })
    }
}

export const listConversations = (authHeader) => {
    return function(dispatch) {
        axios.get('/conversations', {
            ...authHeader,
            params: {
                mailbox: 79656,
                query: '((modifiedAt:[2019-04-01T00:00:00Z TO 2019-05-01T00:00:00Z] AND status:closed) OR status:active OR status:pending)'
            }
        })
            .then(res => {
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