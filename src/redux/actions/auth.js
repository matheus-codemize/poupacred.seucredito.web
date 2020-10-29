import actionsTypes from '../constants/auth';

const actions = {
  signIn: data => ({
    type: actionsTypes.SIGNIN,
    payload: data,
  }),
  logout: () => ({
    type: actionsTypes.LOGOUT,
  }),
  first: (data = false) => ({
    type: actionsTypes.FIRST,
    payload: { primeiro_acesso: data },
  }),
};

export default actions;
