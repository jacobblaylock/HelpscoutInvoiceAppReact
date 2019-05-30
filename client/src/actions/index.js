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
    axios.get('helpscout/conversations', { params })
      .then(res => dispatch({ type: actionTypes.LIST_CONVERSATIONS, conversations: res.data }))
  }
}

export const getThreads = (links) => {
  return function (dispatch) {
    axios.all(links.map(link => axios.get('helpscout/thread', { params: { link } })))
      .then(res => {
        let threads = res.reduce((acc, cur) => {
          let thread = cur.data
          return [...acc, thread]
        }, [])
        console.log(threads)
        dispatch({ type: actionTypes.GET_THREADS, threads: threads })
      })
      .catch(error => {
        console.log(error)
        return error
      })
  }
}
