const axios = require('axios');
const config = require('../config/config');

const run = async (userCoordinate) => {
  try {
    let metroLinesLink = config.metroLinesCloudLink();
    // Getting metro lines:
    let metroLines = await axios.get(metroLinesLink+'');

    let finalDistance = 1_000_000;
    let nearestStation = null;

    for(let metroLine of metroLines.data.response) {
      for(let station of metroLine.data) {
        let dist = calDist(userCoordinate, station.coordinate);
        // console.log(dist);
        if(dist < finalDistance) {
          finalDistance = dist;
          nearestStation = station;
        }
      }
    }

    return {
      nearestStation: nearestStation, 
      distance: finalDistance
    };
  } catch(err) {
    console.error(err);
  }
}



const calDist = (userCoordinate, databaseCoordinate) => {
  if(userCoordinate.indexOf(' ') >= 0) {
    userCoordinateS = userCoordinate.toString().split(', ');
    databaseCoordinateS = databaseCoordinate.toString().split(', ');
  } else {
    userCoordinateS = userCoordinate.toString().split(',');
    databaseCoordinateS = databaseCoordinate.toString().split(',');
  }

  // Getting distance in km:
  let distanceInKm = calcCrow(userCoordinateS[0], userCoordinateS[1], databaseCoordinateS[0], databaseCoordinateS[1]);
  return distanceInKm*1000;
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}



module.exports = {
  run
};