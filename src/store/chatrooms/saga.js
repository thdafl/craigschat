import { all, put, takeLatest, call, fork } from 'redux-saga/effects'
import { FETCH_CHATROOMS } from './types';
import { fetchSuccess, fetchFail } from './actions';
import { rsf } from '../../config/firebase';

function* handleFetchChatrooms() {
  const chatrooms = yield call(rsf.database.read, 'chatrooms');
  
  try {
    yield put(fetchSuccess(chatrooms));
  } catch(e) {
    yield put(fetchFail());
  }
}

function* chatroomsSaga() {
  yield all([
    takeLatest(FETCH_CHATROOMS, handleFetchChatrooms),
    fork(
      rsf.database.sync,
      'chatrooms',
      { successActionCreator: (chatroom) => fetchSuccess(chatroom) }
    )
  ])
}

 export default chatroomsSaga; 