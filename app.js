//#External modules
const express = require('express');
const dotenv = require('dotenv');
const appRoot = require('app-root-dir').get();
const ejsLaout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const passport = require('passport');
const MongoStore = require('connect-mongo');

//#Internal modules
const path = require('path');
const { connectDB } = require('./config/database');

//* app
const app = express();
//Environment variables
dotenv.config({ path: path.join(appRoot, 'config', 'config.env') });
//Define Static folder
app.use(express.static(path.join(appRoot, 'public')));
//Parse req.body
//Parse req.files
//json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());

//*database
connectDB();

//*Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URI }),
  })
);
app.use(flash());

//* Passport authentication
require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());
//*view engine
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(ejsLaout);
app.set('layout', './layouts/mainlayout.ejs');

//*routes
app.use('', require('./routes/mainrouter').router);
app.use('/dashboard', require('./routes/admindashrouter').router);
app.use('/teacherdash', require('./routes/teacherdashrouter').router);
app.use('/studash', require('./routes/studashrouter').router);
app.listen(process.env.PORT, () => {
  console.log('Server is runing');
});

