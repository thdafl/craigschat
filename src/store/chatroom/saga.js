import { all, fork, put, takeLatest, take, call } from 'redux-saga/effects'
import { eventChannel } from 'redux-saga'
import { FETCH_CHATROOMS, FETCH_SUCCESS, FETCH_TERMINATED } from './types';
import { firebaseDb } from '../../config/firebase';

function chatroomsChannel() {
  return eventChannel(emit => {
    const messageRef = firebaseDb.ref('chatrooms');
    messageRef.on("child_added", (snapshot) => {
      let val = snapshot.val();
      emit(val);
    });

    const unsubscribe = () => {
      messageRef.off()
    };

    return unsubscribe
  })
}

function* handleFetchChatrooms() {
  const chatrooms = yield call(chatroomsChannel)
  
  try {
    while(true) {
      const chatroom = yield take(chatrooms);
      console.log("####", chatroom)
      yield put({ type: FETCH_SUCCESS, chatroom })
    }
  } finally {
    console.log("fetching chatrooms terminated")
    yield put({ type: FETCH_TERMINATED })
  }
}

function* watchFetchChatrooms() {
  yield takeLatest(FETCH_CHATROOMS, handleFetchChatrooms)
}

function* chatroomsSaga() {
  yield all([fork(watchFetchChatrooms)])
}

export default chatroomsSaga;