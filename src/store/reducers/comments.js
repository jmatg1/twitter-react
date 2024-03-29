import { Map } from 'immutable'
import * as actionTypes from '../actions/actionTypes'
import commentsDate from '../data/comments'
import { getItem, setItem, arrToMap } from '../../shared/utility'

let commentsStore = getItem('comments')

if (!commentsStore) {
  setItem('comments', commentsDate)
  commentsStore = commentsDate
}

const initialStore = new Map(arrToMap(commentsStore))
// ----------------------------------------

const addComment = (state, { comment }) => {
  return state.set(comment.id, comment)
}

const removeComment = (state, { commentId }) => {
  return state.delete(commentId)
}

const commentsReducer = (state = initialStore, action) => {
  const { payload } = action
  switch (action.type) {
    case actionTypes.COMMENT_ADD: return addComment(state, payload)
    case actionTypes.COMMENT_REMOVE: return removeComment(state, payload)
    default: return state
  }
}

export default commentsReducer
