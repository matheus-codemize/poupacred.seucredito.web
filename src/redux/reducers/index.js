import { combineReducers } from 'redux';

// import all reducers
import boxReducers from './box';
import authReducers from './auth';
import selectReducers from './select';
import sidebarReducers from './sidebar';
import languageReducers from './language';
import navigatorReducers from './navigator';
import simulationReducers from './simulation';

const reducers = combineReducers({
  box: boxReducers,
  auth: authReducers,
  select: selectReducers,
  sidebar: sidebarReducers,
  language: languageReducers,
  navigator: navigatorReducers,
  simulation: simulationReducers,
});

export default reducers;
