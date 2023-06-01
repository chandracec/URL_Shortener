const express = require('express');
const Router=express.Router();
const urlModel = require('../controller/control')

Router.post("/url/shorten",urlModel.shortingUrl)
Router.get("/url/:urlCode",urlModel.getUrl)

module.exports =Router