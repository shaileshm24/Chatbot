var express = require('express');
var app = express(); 
var bodyParser = require('body-parser'); 
//const routesConfig = require('./Controller/route.config');
const PORT = 4000;


app.use(bodyParser.json());

const dialogFlow = require('./dialogFlow.js');
const getEmail = require('./Controller/Email.js');

//const Router = require('./Routes/Router.js');

app.use('/app', dialogFlow);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

