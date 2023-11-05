require('dotenv').config();
const express = require('express');
const app = express()
const morgan = require('morgan');
const {PORT = 3000} = process.env;

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    return res.json({
        status: true,
        message: 'hello',
        error: null,
        data: null
    });
})
const artRouter = require('./routes/art.routes');
app.use('/api/v1/art', artRouter);

app.listen(PORT, () => console.log('listening on port', PORT));