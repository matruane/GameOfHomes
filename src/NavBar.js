import React, { Component } from 'react'
import SearchBar from "./SearchBar"
import './NavBar.css'

class NavBar extends Component {

	render() {
		return (
			<div className="NavBar">
				<div id="navsearch">
					<SearchBar />
				</div>
			</div>
		)
	}
}

export default NavBar