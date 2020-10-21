import React from 'react';
import actionsTypes from '../../constants/box';

const inital_state = {
  help: <></>,
  open: false,
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
