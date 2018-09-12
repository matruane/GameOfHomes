function initialize() {

var input = document.getElementById('searchTextField');
var options = {
  componentRestrictions: {country: 'nz'}
};
var autocomplete = new google.maps.places.Autocomplete(input, options);
}


google.maps.event.addDomListener(window, 'load', initialize);