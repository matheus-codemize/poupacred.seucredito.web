import actionsTypes from '../../constants/select';

const inital_state = {
  id: '',
  value: '',
  filter: '',
  open: false,
  options: [],
  onChange: () => {},
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
