import actionsTypes from '../constants/navigator';

const actions = {
  windowSize: data => ({
    type: actionsTypes.UPDATE,
    payload: { window: { size: { ...data } } },
  }),
  navigatorType: data => ({
    type: actionsTypes.UPDATE,
    payload: { type: data },
  }),
  startLoading: () => ({
    type: actionsTypes.STARTLOADING,
    payload: { loading: true },
  }),
  finishLoading: () => ({
    type: actionsTypes.FINISHLOADING,
    payload: { loading: false },
  }),
};

export default actions;
