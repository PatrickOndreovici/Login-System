const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

//DB config
const db = require('./config/keys').MongoURI;

// Connect to Mongo
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})