import actionsTypes from '../../constants/navigator';

const inital_state = {
  loading: false,
  background: false,
  type: '', // desktop or mobile
  window: {
    size: { y: 0, x: 0 },
  },
};

const reducers = (state = inital_state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionsTypes.UPDATE:
      return { ...state, ...payload };

    case actionsTypes.STARTLOADING:
      if (!state.loading) return { ...state, ...payload };
      return state;

    case actionsTypes.FINISHLOADING:
      if (state.loading) return { ...state, ...payload };
      return state;

    default:
      return state;
  }
};

export default reducers;
