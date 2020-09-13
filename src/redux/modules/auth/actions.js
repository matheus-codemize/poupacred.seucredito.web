export function signInRequest({ username, password }) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: {
      username,
      password,
    },
  };
}

export function signInSuccess({ token, nome }) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: {
      token,
      nome,
    },
  };
}

export function signInFailure() {
  return {
    type: '@auth/SIGN_IN_FAILURE',
  };
}

export function logout() {
  return {
    type: '@auth/LOGOUT',
  };
}
