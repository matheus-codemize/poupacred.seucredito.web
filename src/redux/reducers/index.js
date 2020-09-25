import { combineReducers } from 'redux';

// import all reducers
import authReducers from './auth';
import sidebarReducers from './sidebar';
import languageReducers from './language';

const reducers = combineReducers({
  auth: authReducers,
  sidebar: sidebarReducers,
  language: languageReducers,
});

export default reducers;
