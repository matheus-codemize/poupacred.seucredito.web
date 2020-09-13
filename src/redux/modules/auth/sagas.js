import { takeLatest, call, put, all } from 'redux-saga/effects';
import * as actions from './actions';
import api from '../../../services/api';

export function* signIn({ payload }) {
  try {
    const { username, password } = payload;

    const { data } = yield call(api.post, '/auth/login', {
      username,
      password,
    });
    yield put(actions.signInSuccess({ token: data.token, nome: data.nome }));
  } catch (err) {
    yield put(actions.signInFailure());
  }
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
