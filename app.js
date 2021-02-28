const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const bodyParser = require('body-parser');

// mongoose setup
const mongoose = require("mongoose");
const mongoDb = "mongodb://localhost:27017/MyDb";
mongoose.connect(mongoDb,{useNewUrlParser: true, useUnifiedTopology: true} );


const evaluationRecordsRouter = require('./routes/evaluationRecords');
const externalRouter = require('./routes/externalApplications');

const app = express();

//cors
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/evaluationRecord', evaluationRecordsRouter);
app.use('/external', externalRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
