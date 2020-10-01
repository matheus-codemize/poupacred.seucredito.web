import { combineReducers } from 'redux';

// import all reducers
import authReducers from './auth';
import sidebarReducers from './sidebar';
import languageReducers from './language';
import navigatorReducers from './navigator';

const reducers = combineReducers({
  auth: authReducers,
  sidebar: sidebarReducers,
  language: languageReducers,
  navigator: navigatorReducers,
});

export default reducers;
