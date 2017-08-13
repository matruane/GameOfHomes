var goalLat = -42.400817//-41.286460;
var goalLong = 173.681386//174.776236;

var disArray = []; //straightline distances of earth quakes to location km
var magArray = []; //magnitude of earth quakes
var depArray = []; //depth of earth quakes

//1 degree = 111km
var geocoder = new google.maps.Geocoder();

function geocodeUpdateDamage(geocoder) {
    var searchTextField = document.getElementById('searchTextField').value;
    geocoder.geocode({'address': searchTextField}, function(results, status) {
        if (status === 'OK') {
            var result = results[0];
            var location = result.geometry.location;
            console.log(location.lat(), location.lng());
            goalLat = location.lat();
            goalLng = location.lng();

            getQuakeInfo()
              .then(extractEQInfo)
              .then(calculateRating)
              .then(updateFeedback);

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });


  }

//runs function when pgage has loaded
$(function() {
    $('#input').on('click', function() {
      geocodeUpdateDamage(geocoder);
    });
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
    var hitBy = 0; //amount of quakes 'hit' by
    var damage = 0; //total 'damage' taken from all quakes
    var worstDamage = 8000;

    console.log("Calculating Rating");

    //radius - distance to plug into formula
    for(var i=0; i<100; i++){

        //radius around quake that it can be felt at
        var radius = (magArray.pop()*316/depArray.pop())*5;

        //equation makes 0 equivilent to the edge of earthquake
        var distanceFromQuake = disArray.pop();
        var distanceFromEdge = radius - distanceFromQuake;

        //Not hit by quake
        if(distanceFromQuake > radius) {
            damage += 0;
        }
        //In the outer 90% of quake radius
        else if(distanceFromQuake  > radius*0.1){
            damage += (distanceFromEdge)/10;
            hitBy++;
        }
        //Inside the inner 10% of quake radius
        else{
            //To make equation intercept with damge equation for outer 90%
            var yShift = (radius*0.9)/10;
            var xShift = radius*2.7; //90% * graient = 2.7 for x movement

            damage += (3*distanceFromEdge + yShift) - xShift;
            hitBy++;
        }
    }
    damage = damage/worstDamage;
    console.log(damage + ", " + hitBy);
}

function updateFeedback(){
    console.log("Updating Feedback with rating: ");
}
