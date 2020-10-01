import actionsTypes from '../../constants/navigator';

const inital_state = {
  window: {
    size: { y: 0, x: 0 },
  },
  navigator: {
    type: '', // desktop or mobile
  },
};

const reducers = (state = inital_state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionsTypes.UPDATE:
      return Object.assign({}, state, payload);

    default:
      return state;
  }
};

export default reducers;
