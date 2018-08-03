'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const validUrl = require('valid-url')
const cors = require('cors');
const bodyParser = require('body-parser')
const shortid = require('shortid') 
const db = require('./config')
const Url = require('./model')
const Regex = require("regex")
const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}))
mongoose.connect('mongodb://localhost:27017/urlshortener')
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/:originurl(*)", function (req, res, next) {
  
  let originurl = req.params.originurl

  Url.findOne({url: originurl}, (err, url)=>{
    if(err) res.send(err)
    if(url===null) {
      next()
    }else res.json(url)
    
  })
},(req, res)=>{
  let originurl = req.params.originurl
  let pattern = '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
  let regEx = new RegExp(pattern)
  if (originurl.match(regEx)){
    let lien = {url: originurl,
      shortUrl: `http://${req.headers['host']}/${shortid.generate()}`
    }
    let urlTopersist = new Url(lien)
    Url.create(urlTopersist,(err, lien)=>{
      if(err) {res.json(err)
      
    }else res.json(lien)

    })
  }else res.json({error:'invalid url'})
} );

// Redirection and checking URL shotener

app.get('/:shorturl',(req, res)=>{
  let shorturl = 'http://'+req.headers['host']+'/'+req.params.shorturl
  console.log(shorturl)
  Url.findOne({shortUrl:shorturl}, (err, url)=>{
    console.log(url)
    if(err) return res.status(404).json(err)
    if(url){
      res.redirect(url.url)
  }else res.status(404).send(err)
  
  })
})

app.post('/api/shorturl/new',(req, res, next)=>{
  let originurl = req.body.originurl

  Url.findOne({url: originurl}, (err, url)=>{
    if(err) res.send(err)
    if(url===null) {
      next()
    }else res.json(url)
    
  })
},(req, res)=>{
  let originurl = req.body.originurl
  let pattern = '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
  let regEx = new RegExp(pattern)
  if (originurl.match(regEx)){
    let lien = {url: originurl,
      shortUrl: `http://${req.headers['host']}/${shortid.generate()}`
    }
    let urlTopersist = new Url(lien)
    Url.create(urlTopersist,(err, lien)=>{
      if(err) {res.json(err)
      
    }else res.json(lien)

    })
  }else res.json({error:'invalid url'})
})
app.listen(port, function () {
  console.log('Node.js listening ...');
});