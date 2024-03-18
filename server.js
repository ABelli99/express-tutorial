const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({path: './config/config.env'});

//connect to db
connectDB();

// Route
const bootcamps = require('./routes/bootcamps');

const app = express();

//dev log middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log('started')
);

//handle the unhandled
process.on('unhandledRejection', (err, promise) =>{
    console.log('nah fam, idk what went wrong, check code.');
    console.log(err.message);
    server.close(() => process.exit(1));
});