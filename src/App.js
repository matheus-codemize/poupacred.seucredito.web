import React from 'react';

// redux
import { Provider } from 'react-redux';
import { store, persistor } from './react-redux/store';

import Routes from './Routes';

function App() {
  return (
    <Provider store={store} persistor={persistor}>
      <Routes />
    </Provider>
  );
}

export default App;
