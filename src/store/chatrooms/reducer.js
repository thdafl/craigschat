import { FETCH_CHATROOMS, FETCH_SUCCESS, FETCH_FAIL } from './types';

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
    case FETCH_FAIL:
    return {
      ...state,
      loading: false,
    }
    default:
      return state
  }
}

export default chatroomsReducer; 