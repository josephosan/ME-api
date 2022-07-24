const express = require('express');
const validation = require('../middlewares/validationsMiddleware');
const coordinateValidation = require('../validations/coordinateValidations');
const Coordinates = require('../models/Coordinates');
const { run } = require('../utils/summoner');
const { resDistanceAndTime } = require('../utils/neshanDistanceSummoner');



const router = express.Router();

router.post('', validation(coordinateValidation), async (req, res) => {
  try {
    // checking if it's unique or not:
    let coordinatesInDataBase = await Coordinates.findOne({ coordinate: req.body.coordinate });

    if(coordinatesInDataBase !== null) {
      console.log('inside if block');
      // summoning the calculations:
      let myCoordinateData = await run(req.body.coordinate);

      // summoning data between two points.
      let neshansCoordinateData = await resDistanceAndTime(req.body.coordinate, myCoordinateData.nearestStation.coordinate);


      res.status(200).json({
        success: true,
        myData: myCoordinateData,
        neshanData: neshansCoordinateData,
        message: 'The coordinate already existes in data base!'
      });
      return;
    }
    } catch(err) {
      console.error(err);
      res.status(500).json({
      success: false,
      message: "Internal server Error from loop!",
      errMessage: err.message
    });
    return;
  }
  
  
  try {
    // summoning the calculations:
    let myCoordinateData = await run(req.body.coordinate);

    // summoning data between two points.
    let neshansCoordinateData = await resDistanceAndTime(req.body.coordinate, myCoordinateData.nearestStation.coordinate);

    let coordinates = new Coordinates({
      coordinate: req.body.coordinate
    });

    coordinates = await coordinates.save();

    
    res.status(200).json({
      success: true,
      myData: myCoordinateData,
      neshanData: neshansCoordinateData,
      message: 'The coordinate successfully added!'
    });
  } catch(err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      errMessage: err.message
    });
  }
});



// Get request:
router.get('', async (req, res) => {
  try {
    let coordinates = await Coordinates.find();

    if(!coordinates) {
      res.status(404).json({
        success: true,
        message: 'No coordinate found!'
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: coordinates.length,
      data: coordinates
    })
  } catch(err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error!',
      errMessage: err.message
    });
  }
});

module.exports = router;