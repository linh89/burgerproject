var express = require('express');
var router = express.Router();
var request = require('sync-request');
var mongoose = require('mongoose');
var cityModel = require("../models/cities");
var usersModel = require("../models/connect");
var cityList =[];


/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('login', {});
});

router.get('/weather', async function(req, res, next) {
  if(req.session.user = null){
    res.redirect('/');
  } else {
    var cityList = await cityModel.find();
    res.render('weather', { cityList });
  }
});




router.post('/add-city', async function(req, res, next) {
    var result = await request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${req.body.newcity}&lang=fr&units=metric&appid=20cd646f3aecd01f81a19498896213cd`);
    var resultAPI = JSON.parse(result.body);
    
    var alreadyExistLowerCase = await cityModel.findOne({name: resultAPI.name.toLowerCase()});
    var alreadyExistNormal = await cityModel.findOne({name: resultAPI.name});


    if(alreadyExistNormal == null && alreadyExistLowerCase == null  && resultAPI.name){
      var newCity = new cityModel({
        name: req.body.newcity,
        desc: resultAPI.weather[0].description,
        img: "http://openweathermap.org/img/wn/" + resultAPI.weather[0].icon + ".png",
        temp_min: resultAPI.main.temp_min,
        temp_max: resultAPI.main.temp_max
        
      })
    await newCity.save();
    }
    var cityList = await cityModel.find();
    res.render('weather', { cityList });
});

router.get('/delete-city', async function(req, res, next) {
  await cityModel.deleteOne({_id: req.query.id});
  var cityList = await cityModel.find();
  res.render('weather', {cityList});
});

router.get('/update-city', async function(req, res, next) {
  var cityList = await cityModel.find();
  for(var i=0; i<cityList.length; i++){
    var result = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cityList[i].name}&lang=fr&units=metric&appid=20cd646f3aecd01f81a19498896213cd`);
    var resultAPI = JSON.parse(result.body);
    await cityModel.updateOne(
      {_id: cityList[i].id},
      {
        name: cityList[i].name,
        desc: resultAPI.weather[0].description,
        img: "http://openweathermap.org/img/wn/" + resultAPI.weather[0].icon + ".png",
        temp_min: resultAPI.main.temp_min,
        temp_max: resultAPI.main.temp_max
      }
    );
  }
  var cityList = await cityModel.find();
  res.render('weather', {cityList});
});

router.post('/sign-up', async function(req, res, next) {
  //console.log(req.body.username);
  
    var newUsers = new usersModel({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  
  var newUserSave = await newUsers.save();
  req.session.user = {
    name: newUserSave.username,
    id: newUserSave._id,

  }
  res.redirect('/weather');
});

router.post('/sign-in', async function(req, res, next) {
  var searchUsers = await usersModel.findOne({
    email: req.body.email ,
    password: req.body.password
  });
    
  if(searchUsers !== null){
  req.session.user = {name: searchUsers.username, id: searchUsers._id};
    res.redirect('/weather');
  } else {
    res.render('/login');
  }
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/', {});
});
module.exports = router;
