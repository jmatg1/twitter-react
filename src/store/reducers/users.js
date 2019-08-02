import { fromJS } from 'immutable'
import * as actionTypes from '../actions/actionTypes'
import { objToMap } from '../../shared/utility'
import _ from 'lodash'

const initialStore = null

// ----------------------------------------

const fetchUsers = (state, payload) => {
  const users = _.map(payload, (el) => {
    // если нет такого массива значи он пусто. избавляемся от пустых значений в массиве
    el.tweets = !el.tweets ? [] : el.tweets.filter(() => true)
    el.following = !el.following ? [] : el.following.filter(() => true)
    el.followers = !el.followers ? [] : el.followers.filter(() => true)
    el.ignoreList = !el.ignoreList ? [] : el.ignoreList.filter(() => true)
    return el
  })

  return objToMap(users, fromJS)
}

// Добавление нового пользователя в БД
const signupUser = (state, { newUser }) => {
  return state.set(newUser.id, fromJS(newUser))
}
// Удалить твит
const tweetRemove = (state, { tweet }) => {
  return state
    .updateIn(
      [tweet.createUserId, 'tweets'],
      tweets => tweets.filter(twId => twId !== tweet.id)
    )
}
// Добавить твит
const tweetAdd = (state, { tweet }) => {
  return state
    .updateIn(
      [tweet.createUserId, 'tweets'],
      tweets => tweets.push(tweet.id)
    )
}
// Добавить пользователя в ЧС, по клику на твит
const addUserIgnore = (state, { profileId, userId }) => {
  const uptState = unsubscribe(state, { id: userId, profileId })

  return uptState
    .updateIn(
      [profileId, 'ignoreList'],
      ignoreList => ignoreList.push(userId)
    )
}
// Удалить пользоваетдя из ЧС
const removeUserIgnore = (state, { profileId, userId }) => {
  return state
    .updateIn(
      [profileId, 'ignoreList'],
      ignoreList => ignoreList.filter(igId => igId !== userId)
    )
}
// Подписаться на пользователя
const subscribeUser = (state, payload) => {
  const {
    profileId,
    subscribeId,
    isSubscribed
  } = payload

  if (isSubscribed) {
    return unsubscribe(state, { id: subscribeId, profileId })
  }

  const uptState = state.updateIn( // подписываемся
    [profileId, 'following'],
    following => following.push(subscribeId)
  )

  return uptState.updateIn( // добавляем подписчика
    [subscribeId, 'followers'],
    following => following.push(profileId)
  )
}
// Отписаться от пользователя
const unsubscribe = (state, { id, profileId }) => {
  const uptState = state.updateIn(
    [profileId, 'following'],
    following => following.filter(flId => flId !== id)
  )
  return uptState.updateIn(
    [id, 'followers'],
    following => following.filter(flId => flId !== profileId)
  )
}// Изменить аватарку пользователя
const changeAvatar = (state, { profileId, url }) => {
  return state.updateIn(
    [profileId, 'avatar'],
    avatar => url
  )
}

const usersStore = (state = initialStore, action) => {
  const { payload } = action
  switch (action.type) {
    case actionTypes.USERS_FETCH: return fetchUsers(state, payload)
    case actionTypes.USER_SIGN: return signupUser(state, payload)
    case actionTypes.TWEET_REMOVE: return tweetRemove(state, payload)
    case actionTypes.TWEET_ADD: return tweetAdd(state, payload)
    case actionTypes.USER_ADD_IGNORE: return addUserIgnore(state, payload)
    case actionTypes.USER_REMOVE_IGNORE: return removeUserIgnore(state, payload)
    case actionTypes.USER_SUBSCRIBE: return subscribeUser(state, payload)
    case actionTypes.USER_CHANGE_AVATAR: return changeAvatar(state, payload)
    default: return state
  }
}

export default usersStore
