import { combineReducers } from 'redux';

// import all reducers
import boxReducers from './box';
import authReducers from './auth';
import panelReducers from './panel';
import selectReducers from './select';
import sidebarReducers from './sidebar';
import languageReducers from './language';
import navigatorReducers from './navigator';
import containerReducers from './container';
import simulationReducers from './simulation';

const reducers = combineReducers({
  box: boxReducers,
  auth: authReducers,
  panel: panelReducers,
  select: selectReducers,
  sidebar: sidebarReducers,
  language: languageReducers,
  navigator: navigatorReducers,
  container: containerReducers,
  simulation: simulationReducers,
});

export default reducers;
