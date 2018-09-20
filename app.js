/*Jaspal Bainiwal*/
require('dotenv').config();
var express = require('express');
var app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
var request = require('request');
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

app.get('/', function(req, res){
    request('https://jobs.github.com/positions.json?location=bay+area', function(error, response, body){
        if(!error && response.statusCode == 200){
            var results = JSON.parse(body);
            var temp = [];
            for (let x = 0; x < results.length; x++)
            {
                temp.push(results[x].location);
            }
            geocoder.batchGeocode(temp, function (err, data) {
                if (err || !data.length) {
                    req.flash('error', 'Invalid address');
                    return res.redirect('back');
                }
              
                for (let x = 0; x < results.length; x++)
                {
                    data[x].value[0].name = results[x].company;
                    data[x].value[0].title = results[x].title;
                    data[x].value[0].url = results[x].url;
                }
                
                res.render('home', {data: data});
                });
            }
        });
});


/*app.get("/", function(req, res){
    
    var temp = ['san jose', 'san francisco'];
  geocoder.batchGeocode(temp, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    //console.log(data[0].value[0].latitude);
    res.render('home', {data: data});
    /*
    var lat = data[0].value[0].latitude;
    var lng = data[0].value[0].longitude;
    var location = data[0].value[0].formattedAddress;
    var name = 'san jose';
    var job = {name: name, location: location, lat: lat, lng: lng};*/
    //res.render("home", data, {job: job});
  //});
//});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server on");
});