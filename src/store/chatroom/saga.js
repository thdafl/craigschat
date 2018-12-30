import { all, put, takeLatest, take, call } from 'redux-saga/effects'
import { FETCH_CHATROOMS } from './types';
import { fetchSuccess, fetchTerminated } from './actions';
import { rsf } from '../../config/firebase';

function* handleFetchChatrooms() {
  const channel = yield call(rsf.database.channel, 'chatrooms');

  try {
    while(true) {
      const chatroom = yield take(channel);
      yield put(fetchSuccess(chatroom.value));
    }
  } finally {
    yield put(fetchTerminated())
  }
}

function* chatroomsSaga() {
  yield all([
    takeLatest(FETCH_CHATROOMS, handleFetchChatrooms)
  ])
}

export default chatroomsSaga;