const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require("bcryptjs")

router.get('/login', (req, res) => {
    res.send("login")
})

router.get('/register', (req, res) => {
    res.send("register")
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
        res.send(errors); 
    }
    else{
        User.findOne({name: name}, (err, ans) => {
            if (ans){
                errors.push("This user exists")
                res.send(errors);
            }
            else{
                const newUser = new User({name: name, email: email, password: password});
                newUser.save()
                .then(()=>{
                    res.send("saved");
                })
                .catch((error) => {
                    res.send("error");
                })
            }
        })
    }
})

module.exports = router