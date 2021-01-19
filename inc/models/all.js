const config = require('./../config');
const mongoose = require('mongoose');
const fs = require('fs');

mongoose.Promise = global.Promise;
var Mongodb = mongoose.createConnection('mongodb://localhost:27017/Comment2020',{useNewUrlParser: true, useUnifiedTopology: true});
var Schema = mongoose.Schema;

var models = {};
fs.readdirSync(`${config.projectDir}/inc/models/`).forEach(function(file){
    if(file != 'all.js')
    {
        var name = file.replace('.js', '');
        var incFile = require(`./${name}`);

        models[name] = new incFile(Mongodb);
    }
});

module.exports = models;

