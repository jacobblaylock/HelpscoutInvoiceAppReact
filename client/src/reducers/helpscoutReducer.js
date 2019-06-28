import * as actionTypes from '../actions/types'

export default function (state = {}, action) {
  const { mailboxes, conversations, threads, dbResponse } = action

  switch (action.type) {
    case actionTypes.GET_MAILBOXES:
      return {
        ...state,
        mailboxes
      }
    case actionTypes.LOADING_CONVERSATIONS:
      return {
        ...state,
        loadingConversations: action.loaded !== undefined
          ?
          {
            loaded: action.loaded
          }
          : undefined
      }
    case actionTypes.LIST_CONVERSATIONS:
      return {
        ...state,
        loadingThreads: undefined,
        conversations
      }
    case actionTypes.GET_THREADS:
      return {
        ...state,
        threads
      }
    case actionTypes.LOADING_THREADS:
      return {
        ...state,
        loadingThreads: action.loaded !== undefined
          ?
          {
            loaded: action.loaded,
            count: action.count
          }
          :
          undefined
      }
    case actionTypes.POST_THREADS:
      return {
        ...state,
        dbResponse
      }
    default:
      return state
  }
}

