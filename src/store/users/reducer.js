import { FETCH_USERS, FETCH_USERS_SUCCESS, FETCH_USERS_FAIL, USER_LOGIN, USER_LOGOUT, USER_UPDATE } from './types';

const users = (state = {}, action) => {
  switch(action.type) {
    case FETCH_USERS:
    return {
      ...state,
      loading: true
    }
    case FETCH_USERS_SUCCESS:
    return {
      ...state,
      loading: false,
      users: action.users
    }
    case FETCH_USERS_FAIL:
    return {
      ...state,
      loading: false
    }
    case USER_LOGIN:
    return {
      ...state,
      loginUser: action.user
    }
    case USER_LOGOUT:
    return {
      ...state,
      loginUser: null
    }
    case USER_UPDATE:
    return {
      ...state,
      loginUser: action.user
    }
    default:
      return state
  }
}

export default users;
