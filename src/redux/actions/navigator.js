import actionsTypes from '../constants/navigator';

const actions = {
  window_size: data => ({
    type: actionsTypes.UPDATE,
    payload: { window: { size: { ...data } } },
  }),
  navigator_type: data => ({
    type: actionsTypes.UPDATE,
    payload: { navigator: { type: data } },
  }),
};

export default actions;
