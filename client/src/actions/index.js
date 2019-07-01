import axios from 'axios'
import * as actionTypes from './types'

export const getAuth = () => {
  return function (dispatch) {
    axios.get('helpscout/accessToken')
      .then(res => {
        console.log(res.data)
        dispatch({ type: actionTypes.GET_AUTH, helpscoutHeader: res.data })
      })
  }
}

export const getMailboxes = () => {
  return function (dispatch) {
    axios.get('helpscout/mailboxes')
      .then(res => dispatch({ type: actionTypes.GET_MAILBOXES, mailboxes: res.data }))
  }
}

export const listConversations = (params) => {
  return function (dispatch) {
    dispatch({ type: actionTypes.LOADING_CONVERSATIONS, loaded: false})
    dispatch({ type: actionTypes.LOADING_THREADS })
    axios.get('helpscout/conversations', { params })
      .then(res => { 
        dispatch({ type: actionTypes.LOADING_CONVERSATIONS, loaded: true})
        dispatch({ type: actionTypes.LIST_CONVERSATIONS, conversations: res.data })
      })
  }
}

export const getThreads = (links) => {  
  return function (dispatch) {
    dispatch({ type: actionTypes.LOADING_THREADS, loaded: false, count: links.length })
    axios.all(links.map(link => axios.get('helpscout/thread', { params: { link } })))
      .then(res => {
        let threads = res.reduce((acc, cur) => {
          
          let thread = cur.data
          return { ...acc, ...thread}
        }, [])
        dispatch({ type: actionTypes.LOADING_THREADS, loaded: true, count: 0})
        dispatch({ type: actionTypes.GET_THREADS, threads: threads })
      })
      .catch(error => {
        console.log(error)
        return error
      })
  }
}

export const testDbConnection = () => {
  return function (dispatch) {
    dispatch({ type: actionTypes.DB_CONNECTION_TEST, testing: true })    
    axios.get('osticket/conn')
      .then(res => {
        dispatch({ type: actionTypes.DB_CONNECTION_TEST, testing: false })
        dispatch({ type: actionTypes.DB_CONNECTION, dbConnection: res.data })
      })
  }
}

export const postThreads = (conversations) => {
  return function (dispatch) {
    dispatch({ type: actionTypes.DB_LOADING_TICKETS, loading: true })
    axios.post('osticket/importTickets', conversations)
      .then(res => {
        dispatch({ type: actionTypes.DB_LOADING_TICKETS, loading: false})
        dispatch({ type: actionTypes.POST_THREADS, dbResponse: res.data})
      })
  }
}
