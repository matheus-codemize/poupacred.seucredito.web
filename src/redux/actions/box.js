import actionsTypes from '../constants/box';

const actions = {
  help: data => ({
    type: actionsTypes.UPDATE,
    payload: { help: data },
  }),
  open: () => ({
    type: actionsTypes.UPDATE,
    payload: { open: true },
  }),
  close: () => ({
    type: actionsTypes.UPDATE,
    payload: { open: false },
  }),
};

export default actions;
