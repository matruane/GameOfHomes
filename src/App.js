import React, { Component } from 'react';
import NavBar from "./NavBar"
import SearchBar from "./SearchBar"
import ResultsTable from "./ResultsTable"
import logo from './logo.svg';
import './App.css';

class App extends Component {
	constructor(props) {
		super(props)
	}
  render() {
    return (
      <div className="App">
        <div>
      		<NavBar />
      	</div>
      	<div id='results'>
      	</div>
      </div>
    );
  }
}

export default App;