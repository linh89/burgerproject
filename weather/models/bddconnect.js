var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
   };

mongoose.connect('mongodb+srv://linh:LinhChi0806@cluster0.ujjub.mongodb.net/weatherapp?retryWrites=true&w=majority',
    options,    
    function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Connection OK");
        }
    }
);