var express = require('express');
var router = express.Router();
var request = require('sync-request');
var mongoose = require('mongoose');
var movieModel = require("../models/movies");
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/new-movies', async function(req, res, next) {
  var data = await request("GET", 'https://api.themoviedb.org/3/discover/movie?api_key=6b47f7ae95b4e7b59dda45867f86ca25&language=fr-FR&region=FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&release_date.lte=2020-07-07');
  var datatAPI = JSON.parse(data.body);
  res.json({ result: true, movies:datatAPI.results});
});

router.post('/wishlist-movie', async function(req, res, next) {
  var newMovie = new movieModel({
    movieName: req.body.name,
    movieImg: req.body.img
  })
  var movieSave = await newMovie.save();
  var result = false
  if(movieSave.movieName){
    result = true
  }
  
  res.json({result});
});

router.delete('/wishlist-movie/:name', async function(req, res, next) {
  var deleName = await movieModel.deleteOne({ movieName: req.params.name});
  var result = false
  if(deleName.deletedCount == 1){
    result = true
  }
  res.json({result});
}); 

router.get('/wishlist-movie', async function(req, res, next) {
  var moviesList = await movieModel.find();
  res.json(moviesList);
});

module.exports = router;
