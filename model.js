const mongoose = require('mongoose')
const shortid = require('shortid') 
const findOrCreate = require('mongoose-findorcreate')
const urlSchema = mongoose.Schema({
    url: {
        'type': String,
        
    },
    shortUrl: {
        'type': String,
        
    }
})
urlSchema.plugin(findOrCreate)
module.exports = Url= mongoose.model('Url',urlSchema )