import React from 'react';

class ResultsTable extends React.Component {
	constructor(props) {
		super(props)
        this.lat = this.props.lat
        this.lng = this.props.lng
	}
  
  render() {
    
    return (
    	<table>
            <tbody>
    		<tr>
    			<th>Address</th>
    			<th>Latitude</th>
    			<th>Longitude</th>
    		</tr>
    		<tr>
    			<td>{this.props.address}</td>
    			<td>{this.props.lat}</td>
    			<td>{this.props.lng}</td>
    		</tr>
            </tbody>
    	</table>      
    )
  }
}
export default ResultsTable;