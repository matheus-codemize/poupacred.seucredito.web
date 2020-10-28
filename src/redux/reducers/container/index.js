import actionsTypes from '../../constants/container';

const inital_state = {
  open: false,
  color: 'black',
  loading: false,
  onClose: () => {},
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
