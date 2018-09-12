var goalLat = -42.400817//-41.286460;
var goalLong = 173.681386//174.776236;

var disArray = []; //straightline distances of earth quakes to location km
var magArray = []; //magnitude of earth quakes
var depArray = []; //depth of earth quakes

//1 degree = 111km
var geocoder = new google.maps.Geocoder();

function geocodeUpdateDamage(geocoder) {
    var search = document.getElementById('search').value;
    geocoder.geocode({'address': search}, function(results, status) {
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
    ColorPer(damage,hitBy);
    console.log(damage + ", " + hitBy);
}
function ColorPer(Per,hitBy){
  var color;
  if(Per >=.66){
    var element = document.body;
    element.classList.add("Heavy-Test");
    var element1 = document.getElementById("js_targetme").innerHTML ="HEAVY";
    var num = (Per * 100).toFixed(2);
    var element2 = document.getElementById("Percentage").innerHTML = num.toString() + "% Damage Rating";
    var element3 = document.getElementById("description").innerHTML = "Your house is at risk! it has felt: " + hitBy.toString() +" Earthquakes within the last year";
  //  element.classList.add("Heavy-Text");
  }else if(Per >= .33){
      var element = document.body;
    element.classList.add("Moderate-Test");
    var element1 = document.getElementById("js_targetme").innerHTML ="MODERATE";
    var num = (Per * 100).toFixed(2);
    var element2 = document.getElementById("Percentage").innerHTML = num.toString() + "% Damage Rating";
    var element3 = document.getElementById("description").innerHTML = "Your house is in a bit of riskit has felt: " + hitBy.toString() +" Earthquakes within the last year";;
  }else{
    var element = document.body;
    element.classList.add("Light-Test");
    var element1 = document.getElementById("js_targetme").innerHTML ="LIGHT";
    var num = (Per * 100).toFixed(2);
    var element2 = document.getElementById("Percentage").innerHTML = num.toString() + "% Damage Rating";
    var element3 = document.getElementById("description").innerHTML = "Your house is safe it has felt: " + hitBy.toString() +" Earthquakes within the last year";;
    //description

  }
}

/*function ColorGrade(var PGrade){
  var Grade;
  if(PGrade <=.10){
    Grade = "A+";
  }else if(PGrade <= .15){
    color = "A";
  }else if(PGrade <= .20){
    color = "A-";
  }else if(PGrade <= .25){
    color = "B+";
  }else if(PGrade <= .30){
    color = "B";
  }else if(PGrade <= .35){
    color = "B-";
  }else if(PGrade <= .40){
    color = "C+";
  }else if(PGrade <= .45){
    color = "C";
  }else if(PGrade <= .50){
    color = "C-";
  }else if(PGrade <= .75){
    color = "E";
  }else {
    color = "F";
  }
}*/

function updateFeedback(){
    console.log("Updating Feedback with rating: ");
}
