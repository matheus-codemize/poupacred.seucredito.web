import actionsTypes from '../constants/simulation';

const actions = {
  init: () => ({
    type: actionsTypes.INIT,
  }),
  backStep: () => ({
    type: actionsTypes.BACKSTEP,
  }),
  nextStep: () => ({
    type: actionsTypes.NEXTSTEP,
  }),
  step: data => ({
    type: actionsTypes.UPDATE,
    payload: { step: data },
  }),
  steps: data => ({
    type: actionsTypes.UPDATE,
    payload: { steps: data },
  }),
  register: data => ({
    type: actionsTypes.UPDATE,
    payload: { register: data },
  }),
  initRegister: data => ({
    type: actionsTypes.REGISTER,
    payload: data,
  }),
  lastStep: data => ({
    type: actionsTypes.LASTSTEP,
    payload: data,
  }),
};

export default actions;
