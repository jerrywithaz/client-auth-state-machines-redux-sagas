import { all, put, call, takeLatest, takeEvery } from "redux-saga/effects";
import { confirmUser, loginError, loginSuccess } from "./actions";
import { accountSetupApi, loginApi, logoutApi } from "./apis";
import { AccountSetupAction, AuthActionEnum, LoginAction, User } from "./types";

// ********** The Login Saga and It's Watcher **********

function* loginSaga({ payload: { email, password } }: LoginAction) {
  try {
    const user: User = yield call(loginApi, email, password);

    if (user.confirmed) {
      yield put(loginSuccess(user));
    }
    else {
      yield put(confirmUser(user));
    }
  } catch (error) {
    yield put(loginError(error));
  }
}

function* watchLogin() {
  yield takeLatest(AuthActionEnum.LOGIN, loginSaga);
}

// ********** The Logout Saga and It's Watcher **********

function* logoutSaga() {
  yield call(logoutApi);
}

function* watchLogout() {
  yield takeEvery(AuthActionEnum.LOGOUT, logoutSaga);
}

// ********** The Account Setup Saga and It's Watcher **********

function* accountSetupSaga({ payload }: AccountSetupAction) {
  try {
    const user: User = yield call(accountSetupApi, payload);
    yield put(loginSuccess(user));
  } catch (error) {
    yield put(loginError(error));
  }
}

function* watchAccountSetup() {
  yield takeLatest(AuthActionEnum.ACCOUNT_SETUP, accountSetupSaga);
}

/** The root saga for the authentication state. Initializes all of the authentication sagas */
function* authSagas() {
  yield all([watchLogin(), watchLogout(), watchAccountSetup()]);
}

export default authSagas;
