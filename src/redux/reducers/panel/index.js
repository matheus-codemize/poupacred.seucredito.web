import actionsTypes from '../../constants/panel';

const inital_state = {
  open: false,
  actions: [],
};

const reducers = (state = inital_state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionsTypes.UPDATE:
      return { ...state, ...payload };

    default:
      return state;
  }
};

export default reducers;
