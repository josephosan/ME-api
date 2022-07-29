const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const { linkToCoordinates } = require('../utils/Tools');
const validation = require('../middlewares/validationsMiddleware');
const linkValidation = require('../validations/linkValidation');
const Links = require('../models/Links');
const { run } = require('../utils/summoner');
const { resDistanceAndTime } = require('../utils/neshanDistanceSummoner');

const router = express.Router();

router.post('', validation(linkValidation), async (req, res) => {
  try {
    let userLink = req.body.link;
  
    // getting data from google maps
    let googleMapsData = await axios.get(userLink); 

    if(googleMapsData.status != 200) {
      res.status(400).json({
        success: false,
        message: 'This is not a valid URL!'
      });
      return;
    }

    const $ = cheerio.load(googleMapsData.data);
    let meta = $('meta');
    // the link that google returns contains coordinate data:
    let googleLink = meta[9].attribs.content;
    let coordinates = linkToCoordinates(googleLink);
    
    // only if google returns someting else:
    if(coordinates.lon === undefined || coordinates.lat === undefined) {
      res.status(400).json({
        success: false,
        message: "google maps diden't return valid info.",
      });
      return;
    }



    let userCoordinate = coordinates.lat+', '+coordinates.lon;

    // summoning the calculations:
    let myCoordinateData = await run(userCoordinate);

    // summoning data between two points.
    let neshansCoordinateData = await resDistanceAndTime(userCoordinate, myCoordinateData.nearestStation.coordinate);

    let linkInDataBase = await Links.findOne({ link: req.body.link });
    if(linkInDataBase !== null) {
      res.status(200).json({
        success: true,
        myData: myCoordinateData,
        neshanData: neshansCoordinateData,
        message: 'The link already exists on database!'
      });
      return;
    }

    let links = new Links({
      link: req.body.link
    });

    links = await links.save();

    
    res.status(200).json({
      success: true,
      myData: myCoordinateData,
      neshanData: neshansCoordinateData,
      message: 'Your link successfully added!'
    });
  } catch(err) {
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      errMessage: err.message
    })
  }

});

router.get('/:status', async (req, res) => {
  try {
    if(req.query.onlyCount === "true" && req.params.status === 'count') {
      let links = await Links.find();

    if(!links) {
      res.status(404).json({
        success: true,
        message: 'No coordinate found!'
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: links.length
    });
  } else {
    res.status(404).json({
      success: true,
      message: 'This id does not exists!'
    });
  }
  } catch(err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error!',
      errMessage: err.message
    });
  }
})


module.exports = router;