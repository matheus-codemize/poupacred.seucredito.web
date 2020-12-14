// resources
import register from '../../../resources/data/simulacao/register';

import actionsTypes from '../../constants/simulation';

const inital_state = {
  step: 0,
  register,
  steps: [],
  off: false,
  proposals: [],
  stepBlock: -1,
  isProposal: false,
  isResimulation: false,
};

const reducers = (state = inital_state, action) => {
  const { type, payload } = action;

  switch (type) {
    case actionsTypes.INIT:
      return { ...inital_state };

    case actionsTypes.UPDATE:
      return { ...state, ...payload };

    case actionsTypes.BACKSTEP:
      state.step = state.step - 1;
      return { ...state };

    case actionsTypes.NEXTSTEP:
      state.step = state.step + 1;
      return { ...state };

    case actionsTypes.REGISTER:
      Object.keys(state.register)
        .filter(key => !Object.prototype.hasOwnProperty.call(register, key))
        .forEach(key => {
          delete state.register[key];
        });

      return {
        ...state,
        steps: [],
        register: { ...state.register, ...payload },
      };

    case actionsTypes.LASTSTEP:
      const indexRegister = Object.keys(state.register).indexOf(payload.id);
      const indexSteps = state.steps.findIndex(step => step.id === payload.id);

      if (indexRegister > -1 && indexSteps > -1) {
        state.steps = state.steps.splice(0, indexSteps + 1);
        Object.keys(state.register)
          .filter((_key, index) => index > indexRegister)
          .forEach(key => {
            delete state.register[key];
          });
      }

      return {
        ...state,
        register: { ...state.register, [payload.id]: payload.value },
      };

    case actionsTypes.BLOCKSTEP:
      Object.assign(state, payload);

      if (state.stepBlock === -1) {
        state.step++;
        state.stepBlock = state.step;
      } else {
        state.step = state.stepBlock - 1;
        state.stepBlock = -1;
        state.steps = state.steps.slice(
          0,
          state.step - Object.keys(register).length + 1,
        );
        Object.keys(state.register)
          .filter((_key, index) => index > state.step)
          .forEach(key => {
            delete state.register[key];
          });
      }

      return { ...state };

    default:
      return state;
  }
};

export default reducers;
