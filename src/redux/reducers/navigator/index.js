import actionsTypes from '../../constants/navigator';

const inital_state = {
  loading: false,
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

    case actionsTypes.STARTLOADING:
      if (!state.loading) return Object.assign({}, state, payload);
      return state;

    case actionsTypes.FINISHLOADING:
      if (state.loading) return Object.assign({}, state, payload);
      return state;

    default:
      return state;
  }
};

export default reducers;
