const express= require('express');
const urlModel = require('../models/urlModel');
const validUrl = require('valid-url');
  

const createUrl = async function(req,res){
    let input = req.body;
    let data = await urlModel.create(input);
}