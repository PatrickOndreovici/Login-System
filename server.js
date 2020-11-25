const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const saltRounds = 10
const passport = require('passport')
const User = require('./models/User')
const Strategy = require('passport-local').Strategy
const flash = require('connect-flash')


passport.use(new Strategy((username, password, cb) => {
      User.findOne({name: username}, (err, ans) => {
        if (err){
          return cb(err)
        }
        if (!ans){
          return cb(null, false, {message: "This username is not registered"})
        }
        bcrypt.compare(password, ans.password, function(err, result) {
          if (result){
              return cb(null, ans)
          }
          return cb(null, false, {message: "Wrong password"})
      });
    })
}))

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({_id: id}, (err, ans) => {
    if (err){
      return cb(err)
    }
    return cb(null, ans)
  })
});

const app = express()
const port = 3000

//DB config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log(err))

app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})