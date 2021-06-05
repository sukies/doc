import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter as Routes } from './react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import User from './pages/User';

ReactDOM.render(
  <React.StrictMode>
    <div>123</div>
    <Routes>
      <Route path="/home" component={Home} extract={true}/>
      <Route path="/about" component={About} />
      <Route path="/user" component={User} />
    </Routes>
  </React.StrictMode>,
  document.getElementById('root')
);
