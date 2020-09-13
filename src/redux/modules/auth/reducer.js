const initialState = {
  name: '',
  token: null,
  isAuthenticated: false,
  loadingSignInRequest: false,
  error: false,
};

export default function auth(state = initialState, action) {
  switch (action.type) {
    case '@auth/SIGN_IN_REQUEST':
      return {
        ...state,
        loadingSignInRequest: true,
      };
    case '@auth/SIGN_IN_SUCCESS':
      return {
        ...state,
        loadingSignInRequest: false,
        isAuthenticated: true,
        name: action.payload.nome,
        token: action.payload.token,
      };
    case '@auth/SIGN_IN_FAILURE':
      return {
        ...initialState,
        error: true,
      };
    case '@auth/LOGOUT':
      return {
        ...initialState,
      };
    default:
      return state;
  }
}
