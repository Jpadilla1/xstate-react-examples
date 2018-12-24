import React, { Component } from 'react';
import { ItemPage } from './users/pages/item';
import data from './data';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <ItemPage item={data.users[0]} />
      </div>
    );
  }
}

export default App;
