const express = require("express");
const User = require("../models/userSchema");
const mongoose = require("mongoose");
const { body, validationResult } = require('express-validator');
const { hash } = require("bcrypt");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const secret = "RESTAUTHAPI"



mongoose.connect("mongodb://localhost/userdata_db", (e) => {
    if (e) console.log(e);
    else console.log("connected to user DB");
});

const app = express.Router();

// app.get("/", async (req,res) => {
//     try{
//         const userdata = await User.find();
//         res.status(200).json({
//             status: "Success",
//             userdata: userdata
//         })
//     } catch(e) {
//         res.status(401).json({
//             status: "Failed",
//             message: e.message
//         })
//     }
    
// })

app.post("/register", body('email').isEmail(), body('password').isLength({ min: 5 }), async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        let user = await User.findOne({email});
        if(user) {
            res.status(400).json({
                status: "Failed to register, user already exist with the given email"
            })
        }

        //if user not already exist then register a new user

        bcrypt.hash(password, 10, async function(err, hash) {
            if (err) {
                res.status(400).json({
                    status: "Failed",
                    message: err.message
                })
            }

            user = await User.create({
                name: name,
                email: email,
                password: hash
            })

            res.json({
                status: "Success",
                message: "User succesfully created",
                user
            })
        })


    }catch(e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
});

app.post("/login", body("email").isEmail(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        let user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({
                status: 'Failed',
                message: "There is no account with the mentioned email address"
            })
        }

        bcrypt.compare(password, user.password, async function(err, result) {

            if (err) {
                return res.status(500).json({
                    status: "Failed",
                    message: err.message
                })
            }

            if(result) {
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: user.email
                }, secret)
                return res.status(200).json({
                    status: "Sucess",
                    message: "Login Successfull",
                    token: token
                })
            }
            else{
                return res.status(401).json({
                    status: "Failed",
                    message: "Invalid Credential"
                })
            }
        } )
    } catch(e) {

    }
})

module.exports = app