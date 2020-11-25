const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require("bcryptjs")
const passport = require('passport')
const saltRounds = 10

router.get('/login', (req, res) => {
    let errors = []
    errors.push(req.flash().error)
    res.render('login', {
        errors: errors
    })
})

router.post('/login',
passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/users/login', failureFlash: true}));

router.get('/register', (req, res) => {
    res.render('register', {errors: []})
})

router.post("/register", (req, res) => {
    const {name, email, password, password2} = req.body
    let errors = []
    if (!name || !email || !password || !password2){
        errors.push("Please complete all fields")
    }
    if (password != password2){
        errors.push("Passwords do not match")
    }
    if (password.length < 6){
        errors.push("Password should be at least 6 characters")
    }
    if (errors.length > 0){
        res.render('register', {
            errors: errors
        }); 
    }
    else{
        User.findOne({$or: [{ name: name }, { email: email }]}, (err, ans) => {
            if (ans){
                errors.push("This user exists")
                res.render('register', {errors: errors})
            }
            else{
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    const newUser = new User({name: name, email: email, password: hash});
                    newUser.save()
                    .then(()=>{
                        res.redirect('/')
                    })
                    .catch((error) => {
                        res.send("error");
                    })
                })
            }
        })
    }
})

module.exports = router