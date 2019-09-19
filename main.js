var path = require('path');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
var errorhandler = require('errorhandler');

var app = express();

// compress responses
app.use(compression());

// extended logging
app.use(logger('combined'));

// enable CORS
app.use(cors());

var api = require(process.env.APPDIR + '/be/routes/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

app.use('/api', api);
app.use('/img', express.static(process.env.APPDIR + "/fe/img", { maxAge: 31557600 }));
app.use('/css', express.static(process.env.APPDIR + "/fe/css"));
app.use('/js', express.static(process.env.APPDIR + "/fe/js"));
app.use('/dist', express.static(process.env.APPDIR + "/fe/dist"));
app.use('/static', express.static(process.env.APPDIR + "/fe/static"));
app.use('/views', express.static(process.env.APPDIR + "/fe/views"));
app.use('/lang', express.static(process.env.APPDIR + "/fe/lang"));
app.use('/fonts', express.static(process.env.APPDIR + "/fe/webfonts", { maxAge: 31557600 }));
app.use('/webfonts', express.static(process.env.APPDIR + "/fe/webfonts", { maxAge: 31557600 }));
app.all('/', function(req, res) {
    res.sendFile('index.html', { root: __dirname });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(err.status);
    res.end();
//    next(err);
//  res.redirect('/static/404.html').end();
});

// error handlers
app.use(errorhandler());

//  Catch unauthorised errors
app.use(function(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({
      "message": err.name + ": " + err.message
    });
  }
  next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
