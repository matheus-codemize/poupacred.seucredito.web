import actionsTypes from '../constants/panel';

const actions = {
  open: () => ({
    type: actionsTypes.UPDATE,
    payload: { open: true },
  }),
  close: () => ({
    type: actionsTypes.UPDATE,
    payload: { open: false },
  }),
  actions: data => ({
    type: actionsTypes.UPDATE,
    payload: { actions: data },
  }),
};

export default actions;
