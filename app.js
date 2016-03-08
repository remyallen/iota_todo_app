var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost/to_do_app');
mongoose.model(
    'To_Do',
    new Schema({
            "task": String,
            "complete": Boolean
        },
        {
            collection: 'tasks'
        }
    ));

var To_Do = mongoose.model('To_Do');



app.post('/task', function(req, res) {
    var addTask = new To_Do({
        "task": req.body.task

    });

    addTask.save(function(err, data) {
        if(err) {
            console.log('ERR: ', err);
        }

        To_Do.find({}, function(err, data) {
            if(err) {
                console.log('ERR: ', err);
            }

            res.send(data);
        });
    });
});

app.get('/task', function(req, res) {
    console.log('here');
    To_Do.find({}, function(err, data) {
        if(err) {
            console.log('ERR: ', err);
        }

        res.send(data);
        console.log(data);
    });
});

app.delete('/task/:id', function(req, res) {
    To_Do.findByIdAndRemove({"_id" : req.params.id}, function(err, data) {
        if(err) {
            console.log('ERR: ', err);
        }

        res.send(data);
    });
});


// Serve back static files
app.use(express.static('public'));
app.use(express.static('public/views'));
app.use(express.static('public/scripts'));
app.use(express.static('public/styles'));
app.use(express.static('public/vendors'));

app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});