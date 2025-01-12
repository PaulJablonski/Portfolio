import React from 'https://cdn.skypack.dev/react'; 
import ReactDOM from 'https://cdn.skypack.dev/react-dom';
import { BrowserRouter as Router } from "https://cdn.skypack.dev/react-router-dom@5.3.0";

import App from './App.js';

// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App /> 
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
