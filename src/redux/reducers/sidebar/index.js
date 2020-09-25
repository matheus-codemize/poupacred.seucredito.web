import actionsTypes from '../../constants/sidebar';

const inital_state = {
  open: false
};

const reducers = (state = inital_state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionsTypes.OPEN:
    case actionsTypes.CLOSE:
      return { ...state, ...payload };

    default:
      return state;
  }
};

export default reducers;
