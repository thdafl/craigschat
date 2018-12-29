import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import { all } from 'redux-saga/effects';
import chatroomsSaga from './chatroom/saga';
import chatroomsReducer from './chatroom/reducer';

export const rootReducer = combineReducers({ 
  userReducer,
  chatroomsReducer 
});

export function* rootSaga() {
  yield all([
    chatroomsSaga()
  ])
}