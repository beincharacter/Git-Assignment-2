const express = require("express");
const mongoose = require("mongoose");
const Post = require("../models/postSchema");
const bodyparser = require("body-parser");
mongoose.connect("mongodb://localhost/userdata_db", (e) => {
    if (e) console.log(e);
    else console.log("connected to post DB");
});

const app = express.Router();

app.use(bodyparser.json());

app.post("/posts", async (req, res) => {
    try{
        const posts = await Post.create({
            title: req.body.title,
            discription: req.body.discription,
            user: req.user
        })
        res.json({
            status: "Success",
            posts
        })
    } catch(e) {
        res.status(401).json({
            status: "Failed",
            message: e.message
        })
    }
})

app.get("/", async (req, res) => {
    try{
        const post = await Post.find();
        res.status(200).json({
            status: "Sucess",
            data: post
        })
    } catch(e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
})

module.exports = app