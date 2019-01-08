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
    case 'USER_UPDATE':
    return {
      ...state,
      loginUser: action.user
    }
    default:
      return state
  }
}

export default users;
