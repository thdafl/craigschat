import { all, put, takeLatest, call, fork } from 'redux-saga/effects'
import { FETCH_USERS } from './types';
import { fetchUsersSuccess, fetchUsersFail } from './actions';
import { rsf } from '../../config/firebase';

function* handleFetchUsers() {
  const users = yield call(rsf.database.read, 'users');

  try {
    yield put(fetchUsersSuccess(users));
  } catch(e) {
    yield put(fetchUsersFail());
  }
}

function* usersSaga() {
  yield all([
    takeLatest(FETCH_USERS, handleFetchUsers)
  ])
  yield fork(
    rsf.database.sync,
    'users',
    { successActionCreator: (user) => fetchUsersSuccess(user) }
  );
}

 export default usersSaga; 