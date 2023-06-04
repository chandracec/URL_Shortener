const express = require('express');
const Router=express.Router();
const control = require('../controller/control')

Router.post("/url/shorten",control.shortUrl)
Router.get("/:urlCode",control.getUrl)


Router.use("*",(req,res)=>{
    return res.status(404).send("invalid urls")
})
module.exports =Router
