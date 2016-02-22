var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// bring in pg module
var pg = require('pg');
var connectionString = '';
if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/iota';
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// get data route
app.get('/task', function(req, res) {
    var results = [];
    pg.connect(connectionString, function(err, client, done) {
        var query = client.query('SELECT * FROM todo ORDER BY task_complete, id ASC;');

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // close connection
        query.on('end', function() {
            //client.end();
            done();
            return res.json(results);
        });

        if(err) {
            console.log(err);
        }
    });
});

app.post('/task', function(req, res) {
    var addTask = {
        task_name: req.body.taskCreate,
        task_complete: req.body.taskComplete

    };

    pg.connect(connectionString, function(err, client, done) {
        client.query("INSERT INTO todo (task_name, task_complete) VALUES ($1, $2) " +
            "RETURNING id",
            [addTask.task_name, addTask.task_complete],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

});

app.post('/complete', function(req, res) {
    var completeTask = {
        id: req.body.type
    };
    console.log(req.body.type);

    pg.connect(connectionString, function(err, client, done) {
        client.query("UPDATE todo SET task_complete = NOT task_complete WHERE id = ($1) RETURNING id",
            [completeTask.id],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

});

// Changed to use the 'delete' method (matching our Ajax type property)
app.delete('/delete', function(req, res) {
    var deleteTask = {
        //here id needs to be assigned to what is in the object coming back from line 79 in clientapp.js
        //id: req.body.type is what you're looking for
        id: req.body.type
    };

    pg.connect(connectionString, function(err, client, done) {
        // DELETE syntax in SQL doesn't have VAlUES, just a WHERE to find what you really want to get rid of
        client.query("DELETE FROM todo WHERE id = $1",
            [deleteTask.id],
            function (err, result) {
                done();
                if(err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                } else {
                    res.send(result);
                }
            });
    });

});


app.get('/*', function(req, res) {
    var file = req.params[0] || '/views/index.html';
    res.sendFile(path.join(__dirname, './public', file));
});


app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function() {
    console.log('Listening on port: ', app.get('port'));
});