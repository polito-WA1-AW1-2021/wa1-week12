'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const session = require('express-session'); // session middleware

const passport = require('passport');
const passportLocal = require('passport-local');

const examDao = require('./exam-dao'); // module for accessing the exams in the DB
const userDao = require('./user-dao');



// initialize and configure passport
passport.use(new passportLocal.Strategy((username, password, done) => {
  // verification callback for authentication
  userDao.getUser(username, password).then(user => {
    if(user)
      done(null, user) ;
    else
      done(null, false, {message: 'Username or password wrong'}) ;
  }).catch(err => {
      done(err) ;
  }) ;
}));

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// initialize and configure HTTP sessions
app.use(session({
  secret: 'this and that and other',
  resave: false,
  saveUninitialized: false
})) ;

// tell passport to use session cookies
app.use(passport.initialize()) ;
app.use(passport.session()) ;

/*** Courses/Exams APIs ***/

// GET /api/courses
app.get('/api/courses', (req, res) => {
  if(req.isAuthenticated())
  examDao.listCourses()
    .then(courses => res.json(courses))
    .catch(() => res.status(500).end());
});

// GET /api/exams
app.get('/api/exams', async (req, res) => {
  try {
    const exams = await examDao.listExams();
    res.json(exams);
  } catch (err) {
    res.status(500).end();
  }
});

/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-score-server-mini listening at http://localhost:${port}`);
});