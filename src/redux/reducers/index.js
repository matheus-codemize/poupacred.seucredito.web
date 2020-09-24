import { combineReducers } from 'redux';

// import all reducers
import authReducers from './auth';

const reducers = combineReducers({
  auth: authReducers,
});

export default reducers;
