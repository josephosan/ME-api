const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const appDebug = require('debug')('app:debug');
let morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config');
const metroLines = require('./routes/metro-lines');
const coordinates = require('./routes/coordinates');


dotenv.config({ path: './config/config.env' });

const app = express();

// BODY PARSER:
app.use(express.json());

// ENABLE CORES:
app.use(cors({ }));

// FEATURES:
app.use(morgan('tiny'));

// CONNECTING TO DATABASE:
const dbURL = config.mongoDBLocalURL();
mongoose.connect(dbURL)
  .then(() => appDebug('Connected to mongodb database...'))
  .catch((err) => console.error(err));


// ROUTES:
app.use('/api/metro-lines', metroLines);
app.use('/api/coordinates', coordinates);


// PORT:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  appDebug('Listening to port ' + PORT + '...');
})