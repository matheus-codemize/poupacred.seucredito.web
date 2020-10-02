import actionsTypes from '../../constants/auth';

const inital_state = {
  uid: '',
  nome: '',
  login: '',
  token: '',
  senha: '',
  primeiro_acesso: false,
  type: '', // client or agent
};

const reducers = (state = inital_state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionsTypes.SIGNIN:
      return { ...state, ...payload };

    case actionsTypes.LOGOUT:
      return { ...inital_state };

    case actionsTypes.FIRST:
      return { ...state, primeiro_acesso: payload };

    default:
      return state;
  }
};

export default reducers;
