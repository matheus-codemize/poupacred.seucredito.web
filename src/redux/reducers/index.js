import { combineReducers } from 'redux';

// import all reducers
import authReducers from './auth';
import selectReducers from './select';
import sidebarReducers from './sidebar';
import languageReducers from './language';
import navigatorReducers from './navigator';

const reducers = combineReducers({
  auth: authReducers,
  select: selectReducers,
  sidebar: sidebarReducers,
  language: languageReducers,
  navigator: navigatorReducers,
});

export default reducers;
