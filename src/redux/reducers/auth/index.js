import actionsTypes from '../../constants/auth';

const inital_state = {
  name: '',
  login: '',
  token: '',
  password: '',
  type: '', // client or agent
};

const reducers = (state = inital_state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionsTypes.SIGNIN:
      return { ...payload };

    case actionsTypes.LOGOUT:
      return { ...inital_state };

    default:
      return state;
  }
};

export default reducers;
