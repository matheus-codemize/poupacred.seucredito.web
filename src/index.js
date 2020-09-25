import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';

// style
import './assets/css/global.css'; // reset and normalize style
import './index.css';

// components
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store} persistor={persistor}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
