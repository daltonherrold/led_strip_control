import React, { Component } from 'react';
import LedControl from './components/LedControl';
import './App.css'

class App extends Component {
  render () {
    return (
      <div class="page-wrapper bg-gra-02 font-poppins">
        <div class="wrapper wrapper--w460">
          <div class="card card-4">
            <div class="card-body">
              <h2 class="title">LED Control</h2>
              <LedControl></LedControl>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;