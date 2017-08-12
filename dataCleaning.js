var goalLat = -41.286460;
var goalLong = 174.776236;

//1 degree = 111km

//runs function when pgage has loaded
$(function() {
  // console.log will log a message or object to the browser developer console
  console.log("page loaded...");
  getQuakeInfo(calculateRating);
});


function getQuakeInfo(callback) {

    //returns 100 quakes within last year >= MMI of 5
    var quakeInfo = $.get("https://api.geonet.org.nz/quake?MMI=5");

    //runs function when quakeInfo query finishes
    quakeInfo.done(function(quakeData) {
      callback(quakeData);
    });
}

//Takes all of the 100 earthquakes and finds a rating based on given latitude longitude of location
function calculateRating(earthQuakes){

    var disArray = []; //straightline distances of earth quakes to location km
    var magArray = []; //magnitude of earth quakes
    var depArray = []; //depth of earth quakes

    for(var i = 0; i < 100; i++){
        var long = earthQuakes.features[i].geometry.coordinates[0];
        var lat = earthQuakes.features[i].geometry.coordinates[1];

        var longDif = goalLong - long;
        var latDif = goalLat - lat;
        var straightDis = Math.sqrt(Math.pow(longDif,2)+Math.pow(latDif,2));
        straightDis = straightDis * 111;

        disArray.push(straightDis);
        magArray.push(earthQuakes.features[i].properties.magnitude);
        depArray.push(earthQuakes.features[i].properties.depth);
    }
}
