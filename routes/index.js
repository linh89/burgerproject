var express = require('express');
var router = express.Router();
var dataBike = [
  {name:'BIKO45' , src: '/images/bike-1.jpg',price: 679},
  {name:'ZOOK7' , src: '/images/bike-2.jpg',price: 799},
  {name:'LIK089' , src: '/images/bike-3.jpg',price: 839},
  {name:'GEWO8' , src: '/images/bike-4.jpg',price: 1249},
  {name:'KIWIT' , src: '/images/bike-5.jpg',price: 899},
  {name:'NASAY' , src: '/images/bike-1.jpg',price: 1399}
];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bikeshop' , dataBike});
});


module.exports = router;
