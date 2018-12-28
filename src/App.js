import React, { Component } from 'react';
import { Login } from './auth/pages/Login'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <Login />
      </div>
    );
  }
}

export default App;
