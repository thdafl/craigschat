import { FETCH_CHATROOMS, FETCH_SUCCESS, FETCH_TERMINATED } from './types';

const initialState = {
  chatrooms: []
}

const chatroomsReducer = (state = initialState, action) => {
  switch(action.type) {
    case FETCH_CHATROOMS:
    return {
      ...state,
      loading: true
    }
    case FETCH_SUCCESS:
    return {
      ...state,
      chatrooms: action.chatroom,
      loading: false
    }
    case FETCH_TERMINATED:
    return {
      ...state,
      loading: false,
      message: "fetching chatrooms terminated"
    }
    default:
      return state
  }
}

export default chatroomsReducer;