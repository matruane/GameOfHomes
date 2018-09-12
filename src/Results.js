import React from 'react';

class Results extends React.Component {
    constructor(props) {
        super(props)
        this.lat = this.props.lat
        this.lng = this.props.lng

        this.state = {damage: 0};
    }

disArray = []; //straightline distances of earth quakes to location km
magArray = []; //magnitude of earth quakes
depArray = []; //depth of earth quakes

damage = 0;

//1 degree = 111km

//runs function when pgage has loaded
componentDidMount() {
  this.getQuakeInfo()
  .then(rawInfo => this.extractEQInfo(rawInfo))
  //.then(rawInfo => console.log(rawInfo))
  .then(EQinfo => this.calculateRating(EQinfo))
  .then(rating => this.updateFeedback(rating));
}


getQuakeInfo() {
    //returns 100 quakes within last year >= MMI of 5
    return fetch('https://api.geonet.org.nz/quake?MMI=5')
            .then(res => res.json());
}

//Takes all of the 100 earthquakes and feeds magnitude, distance and depth to lists
extractEQInfo(earthQuakes){

    console.log("Extracting E.Q Info");
    //console.log(earthQuakes);

    for(var i = 0; i < 100; i++){
        var long = earthQuakes.features[i].geometry.coordinates[0];
        var lat = earthQuakes.features[i].geometry.coordinates[1];
        //console.log(long);

        var longDif = this.lng - long;
        var latDif = this.lat - lat;
        console.log(longDif +" lon, "  + latDif + " lat")
        var straightDis = Math.sqrt(Math.pow(longDif,2)+Math.pow(latDif,2));
        straightDis = straightDis * 111;

        console.log(straightDis);


        this.disArray.push(straightDis);
        this.magArray.push(earthQuakes.features[i].properties.magnitude);
        this.depArray.push(earthQuakes.features[i].properties.depth);
    }
}

calculateRating(){
    var hitBy = 0; //amount of quakes 'hit' by
    var damageVal = 0; //total 'damage' taken from all quakes
    var worstDamage = 8000;


    console.log("Calculating Rating");

    //radius - distance to plug into formula
    for(var i=0; i<100; i++){

        //radius around quake that it can be felt at
        var radius = (this.magArray.pop()*316/this.depArray.pop())*5;

        //equation makes 0 equivilent to the edge of earthquake
        var distanceFromQuake = this.disArray.pop();
        var distanceFromEdge = radius - distanceFromQuake;

        //Not hit by quake
        if(distanceFromQuake > radius) {
            damageVal += 0;
        }
        //In the outer 90% of quake radius
        else if(distanceFromQuake  > radius*0.1){
            damageVal += (distanceFromEdge)/10;
            hitBy++;
        }
        //Inside the inner 10% of quake radius
        else{
            //To make equation intercept with damge equation for outer 90%
            var yShift = (radius*0.9)/10;
            var xShift = radius*2.7; //90% * graient = 2.7 for x movement

            damageVal += (3*distanceFromEdge + yShift) - xShift;

            hitBy++;
        }
            }
    damageVal = damageVal/worstDamage;
    console.log(damageVal + ", " + hitBy);
    //this.damage = damageVal;

    this.setState({damage: damageVal});
}

updateFeedback(){
    console.log("Updating Feedback with rating: ");
}

render() {
    return(
            <div>
                Damage: {this.state.damage}
            </div>
        )
}

}
export default Results;
