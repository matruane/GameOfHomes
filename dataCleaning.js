var goalLat = -41.286460;
var goalLong = 174.776236;

var disArray = []; //straightline distances of earth quakes to location km
var magArray = []; //magnitude of earth quakes
var depArray = []; //depth of earth quakes

//1 degree = 111km

//runs function when pgage has loaded
$(function() {
  getQuakeInfo()
    .then(extractEQInfo)
    .then(calculateRating)
    .then(updateFeedback);
});


function getQuakeInfo() {
    //returns 100 quakes within last year >= MMI of 5
    return $.get("https://api.geonet.org.nz/quake?MMI=5");
}

//Takes all of the 100 earthquakes and feeds magnitude, distance and depth to lists
function extractEQInfo(earthQuakes){

    console.log("Extracting E.Q Info");
    
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

function calculateRating(){
    console.log("Calculating Rating");
}

function updateFeedback(){
    console.log("Updating Feedback");
}
