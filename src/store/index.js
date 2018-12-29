import { combineReducers } from 'redux';
import users from './users/reducer';
import { all } from 'redux-saga/effects';
import chatroomsSaga from './chatroom/saga';
import chatroomsReducer from './chatroom/reducer';

export const rootReducer = combineReducers({ users, chatroomsReducer });

export function* rootSaga() {
  yield all([
    chatroomsSaga()
  ])
}