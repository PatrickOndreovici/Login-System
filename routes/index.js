const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/', (req, res) => {
    if (req.user) {
        User.find({}, function(err, users) {
            res.render('index', {users: users});
         })
    } else {
        req.flash('error', 'login first please')
        res.redirect('/users/login')
    }
})

module.exports = router