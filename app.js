var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const log = require('./config/log')
var home = require('./routes/index');
var product = require('./routes/product');
var cart = require('./routes/cart');
var order = require('./routes/order');
var user = require('./routes/user');
var app = express();
app.set('jwtTokenCommunity', 'community-hyw')
global.log = log
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(async function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  try {
    await next()
  } catch (error) {
    log.e(req, error)
  }
  // render the error page
  // res.status(err.status || 500);
  // res.render('error');
})
app.use('/', home)
app.use('/product', product)
app.use('/cart', cart)
app.use('/order', order)
app.use('/user', user)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
