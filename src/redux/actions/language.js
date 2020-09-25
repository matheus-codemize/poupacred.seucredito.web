import actionsTypes from '../constants/language';

const actions = {
  update: data => ({
    type: actionsTypes.UPDATE,
    payload: data,
  }),
  reset: () => ({
    type: actionsTypes.UPDATE,
  }),
};

export default actions;
