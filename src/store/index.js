import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import usersSaga from './users/saga';
import usersReducer from './users/reducer';
import chatroomsSaga from './chatrooms/saga';
import chatroomsReducer from './chatrooms/reducer';

export const rootReducer = combineReducers({ 
  usersReducer,
  chatroomsReducer
});

export function* rootSaga() {
  yield all([
    chatroomsSaga(),
    usersSaga()
  ])
}