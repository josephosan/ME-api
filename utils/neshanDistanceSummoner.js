const axios = require('axios');
const config = require('../config/config');

const getDistAndTime = async (userCoordinate, metroCoordinate) => {
  try {
    if(userCoordinate.indexOf(' ') >= 0) {
      latUserCoordinate = userCoordinate.split(', ')[0];
      lonUserCoordinate = userCoordinate.split(', ')[1];
      latMetroCoordinate = metroCoordinate.split(', ')[0];
      lonMetroCoordinate = metroCoordinate.split(', ')[1];  
    } else {
      latUserCoordinate = userCoordinate.split(',')[0];
      lonUserCoordinate = userCoordinate.split(',')[1];
      latMetroCoordinate = metroCoordinate.split(',')[0];
      lonMetroCoordinate = metroCoordinate.split(',')[1]; 
    }
    
    let car = await axios.get(config.neshanDistanceURL(`${latUserCoordinate},${lonUserCoordinate}`
    ,`${latMetroCoordinate},${lonUserCoordinate}`,'car')+'',{
      headers: {
        "API-KEY": "service.30eafacc7a1a417a9ec8e949dd5e1606"
      }
    });

    let motorcycle = await axios.get(config.neshanDistanceURL(`${latUserCoordinate},${lonUserCoordinate}`
    ,`${latMetroCoordinate},${lonUserCoordinate}`,'motorcycle')+'',{
      headers: {
        "API-KEY": "service.30eafacc7a1a417a9ec8e949dd5e1606"
      }
    });

    return {
      car: car.data,
      motorcycle: motorcycle.data
    };
  } catch(err) {
    console.log(err);
  }
}

const resDistanceAndTime = async (userCoordinate, metroCoordinate) => {
  try {
    let data =  await getDistAndTime(userCoordinate, metroCoordinate);
    return data;
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  resDistanceAndTime
}