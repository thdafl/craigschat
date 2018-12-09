const users = (state = {}, action) => {
  switch(action.type) {
    case 'USER_LOGIN':
    return {
      ...state,
      loginUser: action.user
    }
    case 'USER_LOGOUT':
    return {
      ...state,
      loginUser: null
    }
    default:
      return state
  }
}

export default users;