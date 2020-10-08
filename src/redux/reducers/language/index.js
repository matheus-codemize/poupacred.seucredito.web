import actionsTypes from '../../constants/language';

const inital_state = {
  currency: 'BRL',
  locale: 'pt-BR',
  dateFormat: 'DD / MM / AAAA',
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
