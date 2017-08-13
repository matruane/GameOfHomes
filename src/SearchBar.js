import React from 'react';
import PropTypes from 'prop-types';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
//import './SearchBar.css';
import Results from './Results'
import ReactDOM from 'react-dom';

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { address: 'Flux Federation 47/Hanson Street, Mount Cook, Wellington',
                  }
    this.onChange = (address) => this.setState({ address })
  }

  handleEnter = (event) => {

    geocodeByAddress(this.state.address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => this.showResults( lat, lng))
    //  .catch(error => console.error('Error', error))
  }

  handleFormSubmit = (event) => {
    
  }


  showResults(lat, lng) {
    ReactDOM.render(<Results address={this.state.address} lat={lat} lng={lng} />, document.getElementById('results'))
  }

  render() {
    const inputProps = {
      value: this.state.address,
      onChange: this.onChange,
    }
    const options = {
      componentRestrictions: {country: 'nz'}
    }
    const myStyles = {
      input: { width: '50%',
               backgroundColor: 'silver'
              }
    }

    return (
      <form>
        <PlacesAutocomplete
         inputProps={inputProps}
         options={options}
         styles={myStyles}
         onEnterKeyDown={this.handleEnter}
          />
      </form>
    )
  }
}
export default SearchBar;