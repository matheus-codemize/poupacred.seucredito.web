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
    case actionsTypes.FIRST:
    case actionsTypes.SIGNIN:
      return { ...state, ...payload };

    case actionsTypes.LOGOUT:
      return { ...inital_state };

    default:
      return state;
  }
};

export default reducers;
