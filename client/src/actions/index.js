import axios from 'axios'
import * as actionTypes from './types'

export const getAuth = () => {
    return function(dispatch) {
        axios.get('api/accessToken')
            .then(res => {
                console.log(res.data)
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
    return function(dispatch) {
        axios.get('/conversations', { ...authHeader, params })
            .then(res => {
                console.log(res)
                return { ...res.data.page, link: res.data._links.page.href }
            })
            .then(res => {
                let links = []
                for(let i = 1; i <= res.totalPages; i++) {
                    links.push(`${res.link}&page=${i}`)
                }
                axios.all(links.map(link => axios.get(link, { headers: authHeader.headers })))
                .then(res => {
                    let conversations = res.reduce((acc, cur) => {
                        let conversation = cur.data._embedded.conversations
                        return [ ...acc, ...conversation ]
                    }, [])
                    dispatch({ type: actionTypes.LIST_CONVERSATIONS, conversations: conversations.map(convo => {
                        return {
                            id: convo.id,
                            number: convo.number,
                            status: convo.status,
                            assignee: convo.assignee,
                            customFields: convo.customFields,
                            subject: convo.subject,
                            preview: convo.preview,
                            threadLink: convo._links.threads.href
                        }
                    })})
                })
            })
    }
}

export const getThreads = (authHeader, links) => {
    return function(dispatch) {
        axios.all(links.map(link => axios.post('api/thread', { link, headers: authHeader.headers})))        
            .then(res => {
                console.log(res)
                let threads = res.reduce((acc, cur) => {
                    let thread = cur.data
                    return [ ...acc, ...thread ]
                }, [])
                dispatch({ type: actionTypes.GET_THREADS, threads: threads})
            })
            .catch(error => {
                console.log(error)
                return error
            })
    }
}



