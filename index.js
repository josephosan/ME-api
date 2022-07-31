const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const appDebug = require('debug')('app:debug');
let morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config');
const metroLines = require('./routes/metro-lines');
const coordinates = require('./routes/coordinates');
const home = require('./routes/home');
const linkCoordinate = require('./routes/linkCoordinate');


const helmet = require('helmet');
const users = require('./routes/users');
const summonerNewsEamiler = require('./utils/summonerNewsEmailer');

dotenv.config({ path: './config/config.env' });

const app = express();

// BODY PARSER:
app.use(express.json());
app.use(helmet());

// ENABLE CORES:
app.use(cors({ }));

// FEATURES:
app.use(morgan('tiny'));

// CONNECTING TO DATABASE:
const dbURL = config.mongoDBCloudURL('joseph', '09917758802rAAAjoseph.o');
const localDB = config.mongoDBLocalURL();
mongoose.connect(localDB)
  .then(() => {
    appDebug('Connected to metro-finder data base ...')
  })
  .catch((err) => console.error(err));


// metro-finder routes :
app.use('/api/metro-finder/metro-lines', metroLines);
app.use('/api/metro-finder/coordinates', coordinates);
app.use('/api/metro-finder/link-coordinates', linkCoordinate);

// news-emailer routes :
app.use('/api/news-emailer/users', users);
app.use('/api/news-emailer/users-data', summonerNewsEamiler.allData);


// home route : 
app.use('', home);


// PORT:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  appDebug('Listening to port ' + PORT + '...');
})