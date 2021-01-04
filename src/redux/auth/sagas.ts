import { all, put, call, takeLatest, takeEvery } from "redux-saga/effects";
import { confirmUser, loginError, loginSuccess } from "./actions";
import { accountSetupApi, loginApi, logoutApi } from "./apis";
import { AccountSetupAction, AuthActionEnum, LoginAction, User } from "./types";

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

function* loginSagaWatcher() {
  yield takeLatest(AuthActionEnum.LOGIN, loginSaga);
}

function* logoutSaga() {
  yield call(logoutApi);
}

function* logoutSagaWatcher() {
  yield takeEvery(AuthActionEnum.LOGOUT, logoutSaga);
}

function* accountSetupSaga({ payload }: AccountSetupAction) {
  try {
    const user: User = yield call(accountSetupApi, payload);
    yield put(loginSuccess(user));
  } catch (error) {
    yield put(loginError(error));
  }
}

function* accountSetupSagaWatcher() {
  yield takeLatest(AuthActionEnum.ACCOUNT_SETUP, accountSetupSaga);
}

function* authSagas() {
  yield all([loginSagaWatcher(), logoutSagaWatcher(), accountSetupSagaWatcher()]);
}

export default authSagas;
