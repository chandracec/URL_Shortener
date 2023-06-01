const express = require('express');
const mongoose = require('mongoose')
const validUrl = require('valid-url');
  

const urlSchema = new mongoose.Schema({
  urlCode: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  longUrl: {
    type: String,
    required: true,
    // validate: {
    //   validator: function(value) {
    //     // Regular expression to validate URL format
    //      const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    //     return urlRegex.test(value);
    //   },
    //   message: 'Invalid URL format'
    // }
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true
  }
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;



// { urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }