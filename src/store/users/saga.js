import { put, takeLatest, call, fork, take } from 'redux-saga/effects'
import { FETCH_USERS, USER_DELETE, USER_UPDATE } from './types';
import { fetchUsersSuccess, fetchUsersFail, userLogin, userLogout, userUpdateSuccess } from './actions';
import { rsf } from '../../config/firebase';
import { firebaseDb } from '../../config/firebase'

function* handleFetchUsers() {
  const users = yield call(rsf.database.read, 'users');

  try {
    yield put(fetchUsersSuccess(users));
  } catch(e) {
    yield put(fetchUsersFail());
  }
}

function* handleUpdateUser(action) {
  console.log("Updating User", action.user)

  try {
    yield call(rsf.database.patch, `users/${action.user.id}`, {...action.user});
    yield put(userUpdateSuccess(action.user))
  }
  catch(error) {
    console.log("Updating User Failed")
  }
}

function* handleDeleteUser(action) {
  try {
    console.log("Deleting User")
    yield call(rsf.database.patch, `users/${action.user.id}`, {deleted: true});
    yield call(rsf.auth.signOut);
    const chatrooms = yield call(rsf.database.read, 'chatrooms');

    console.log("Deleting Associated Chatrooms")
    Object.values(chatrooms).map(chatroom => chatroom.owner.id === action.user.id && firebaseDb.ref(`chatrooms/${chatroom.id}/archived/`).set(true))
  }
  catch(error) {
    console.log("Deleting User Failed")
  }
}


function* syncUser() {
  const channel = yield call(rsf.auth.channel);

  while(true) {
    const { user } = yield take(channel);

    if (user) {
      console.log("User LoggedIn")
      const currentUser = yield call(rsf.database.read, `users/${user.uid}`);

      if (currentUser) { 
        yield put(userLogin(currentUser))
        yield call(rsf.database.patch, `users/${user.uid}`, { online: true })
      } else {
        console.log("User is not existing in db. Creating user.")
        yield call(rsf.database.update, `users/${user.uid}`,
        {
          "id": user.uid,
          "name" : user.displayName,
          "email" : user.email,
          "photoUrl" : user.photoURL,
          "provider": user.providerData[0].providerId,
          "online": true
        })
        const createdUser = yield call(rsf.database.read, `users/${user.uid}`);
        yield put(userLogin(createdUser))
      }
    } else {
      console.log("User is not being signedIn or just Signed out")
      yield put(userLogout())
    }
  }
}

function* usersSaga() {
  yield takeLatest(FETCH_USERS, handleFetchUsers)
  yield takeLatest(USER_UPDATE, handleUpdateUser)
  yield takeLatest(USER_DELETE, handleDeleteUser)
  yield fork(syncUser)
  yield fork(
    rsf.database.sync,
    'users',
    { successActionCreator: (user) => fetchUsersSuccess(user) }
  )
}

 export default usersSaga; 