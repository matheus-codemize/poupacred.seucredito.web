import actionsTypes from '../constants/container';

const actions = {
  open: data => ({
    type: actionsTypes.UPDATE,
    payload: { open: true, ...data },
  }),
  close: () => ({
    type: actionsTypes.UPDATE,
    payload: { open: false, loading: false },
  }),
  loading: data => ({
    type: actionsTypes.UPDATE,
    payload: { open: true, loading: true, ...data },
  }),
};

export default actions;
