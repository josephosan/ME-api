const express = require('express');
const { string } = require('yup');
const MetroLines = require('../models/MetroLines');

const router = express.Router();

// GET DATA:
router.get('', async (req, res) => {
  try {
    let metroLines = await MetroLines.find();
    return res.status(200).json({
      success: true,
      response: metroLines
    });
  } catch(err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      error: 'Server Error!'
    });
  }
});

// router.post('', async (req, res) => {
//   try {  
//     let metroLines = new MetroLines({
//       line: req.body.line,
//       data: req.body.data
//     });


//     metroLines = metroLines.save();
//     res.status(200).json({
//       success: true,
//       data: metroLines
//     });
//   } catch (err) {
//     console.error(err);
//   }
// });



module.exports = router;