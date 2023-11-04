require('dotenv').config();
const express = require('express');
const app = express()
const morgan = require('morgan');
const {PORT = 3000} = process.env;

app.use(morgan('dev'));
app.use(express.json());

const artRouter = require('./routes/art.routes');
app.use('/api/v1/art', artRouter);

app.listen(PORT, () => console.log('listening on port', PORT));