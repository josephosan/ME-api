const express = require('express');
const router = express.Router();
const validation = require('../middlewares/validationsMiddleware');
const User = require('../models/user');
const appDebug = require('debug')('app:debug');
const userSchema = require('../validations/userValidation');
const emailValidation = require('../validations/emailValidation');



router.post('/', validation(userSchema), async (req, res) => {
  if(req.body.name === 'deleteMeFromDataBase') {
    try {
      let deletedUser = await User.deleteOne({ email: req.body.email });
      console.log(deletedUser);
      if(deletedUser.deletedCount === 1) {
        res.status(200).json({
          success: true, 
          message: 'The email successfully deleted.'
        });
        return;
      }
      else {
        res.status(404).json({
          success: false,
          message: 'This email does not exists!!'
        });
        return;
      }
    } catch(err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: 'Internal server error!',
        errMessage: err.message
      });
      return;
    }
  }
  let users = await User.find();

  for (let user of users) {
    if(user.name === req.body.name) {
      res.status(400).json({
        success: false,
        message: 'This name is already taken'
      });
      return;
    }
    if(user.email === req.body.email) {
      res.status(400).json({
        success: false,
        message: 'This email already exists'
      });;
      return;
    }
  }

  let newUser = new User({
    name: req.body.name,
    email: req.body.email
  });

  try {
    newUser = await newUser.save();
    if(!newUser) {
      res.status(500).json({
        success: false,
        message: 'Email dident save!'
      });
      return;
    }

    res.status(200).json({
      success: true,
      response: newUser
    });

  } catch(err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Internal server error!',
      errMessage: err.message
    })
  }
});


// for getting number of users:
router.get('/:status', async (req, res) => {
  try {
    if(req.query.onlyCount === "true" && req.params.status === 'count') {
      let users = await User.find().select('name');
      if(!users) {
        res.status(404).json({
          success: false,
          message: 'No user found!'
        });
        return;
      }
  
      let counter = 0;
  
      for(let user in users) {
        counter++;
      }
  
      res.status(200).json({
        success: true,
        count: counter+""
      });
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({
      success: true,
      message: 'Internal server Error!',
      errMessage: err.message
    });
    return;
  }
});


router.delete('/', validation(emailValidation), async (req, res) => {
  try {
    let deletedUser = await User.deleteOne({ email: req.body.email });
    console.log(deletedUser);
    if(deletedUser.deletedCount === 1) {
      res.send('The email successfully deleted.');
      return;
    }
    else {
      res.status(404).send('This email does not exists!!');
      return;
    }
  } catch(err) {
    console.error(err);
    res.send('Something went wrong!');
    return;
  }
});



module.exports = router;