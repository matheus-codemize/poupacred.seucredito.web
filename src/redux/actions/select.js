import actionsTypes from '../constants/select';

const actions = {
  update: data => ({
    type: actionsTypes.UPDATE,
    payload: data,
  }),
};

export default actions;
