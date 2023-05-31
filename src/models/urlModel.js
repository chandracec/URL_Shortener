const mongoose = require('mongoose')
const UrlSchema = mongoose.Schema({
  urlCode: {require:true,unique:true,trim:true,lowercase:true},
})

module.exports = mongoose.model('Url', UrlSchema)



// { urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }