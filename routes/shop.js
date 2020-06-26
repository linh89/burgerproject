var express = require('express');
var router = express.Router();

function addBikeIfExist(bikes, name) {
  for(var i = 0; i < bikes.length; i++) {
    if(bikes[i].name == name) {
    bikes[i].quantity += 1;
    return true;
    }
  }
  return false;
};

router.get('/', function(req, res, next) {
  if(req.session.dataCardBike == undefined){
    req.session.dataCardBike = [];
  }
  if(!addBikeIfExist(req.session.dataCardBike , req.query.bikeName)){
    req.session.dataCardBike.push({
      name: req.query.bikeName,
      src: req.query.bikeSrc,
      price: req.query.bikePrice,
      quantity: 1
    });
  var dataCardBike = req.session.dataCardBike;
  }
  res.render('shop', {dataCardBike:req.session.dataCardBike });
});

router.get('/delete', function(req, res, next){
  var dele = req.query;
  req.session.dataCardBike.splice(dele.position , 1)
  res.render('shop', { dataCardBike : req.session.dataCardBike});
  });

router.post('/update-shop', function(req, res, next) {
  var position = req.body.position;
  var newQuantity = req.body.quantity;
  dataCardBike[position].quantity = newQuantity;
  res.render('shop',{dataCardBike});
});


module.exports = router;