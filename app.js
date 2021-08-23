var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

  // Import routes:
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');
const catalogRouter = require('./routes/catalog');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const producerRouter = require('./routes/producer');
const commentRouter = require('./routes/comment');
const discountRouter = require('./routes/discount');
const cartRouter = require('./routes/cart');
const sizeRouter = require('./routes/size');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: ['http://localhost:3000','http://localhost:3001'],
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE'],
  credentials: true
}));
app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1200000 }
}));
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use(limiter);


app.use('/api', indexRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/binh-luan', commentRouter);
app.use('/api/v1/danh-muc', catalogRouter);
app.use('/api/v1/don-hang', orderRouter);
app.use('/api/v1/gio-hang', cartRouter);
app.use('/api/v1/khach-hang', usersRouter);
app.use('/api/v1/khuyen-mai', discountRouter);
app.use('/api/v1/nha-san-xuat', producerRouter);
app.use('/api/v1/san-pham', productRouter);
app.use('/api/v1/size', sizeRouter);

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
