var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var assert = require('assert')
    // app.get('/', function(req, res) {
    //     res.send('Hello world from sever.js');
    // })
    //

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '10.1.4.23',
    //host:'localhost',
    user: 'root',
    password: 'root',
    //password: 'mysql',

    database: 'bms'

});


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.get("/currentdata", function(req, res) {
    var sql = 'SELECT * FROM bms.batteryData order by timestp desc limit 20 ';
    //var sql = 'SELECT * FROM bms.batterydata order by timestp desc limit 1 '; //for local DB
    connection.query(sql, function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.json(rows);
        } else {
            console.log('Error while performing Query.');
        }
    });
});

app.get("/initialcurrentdata", function(req, res) {
    var sql = 'SELECT * FROM bms.batteryData order by timestp desc limit 20 ';
    //var sql = 'SELECT * FROM bms.batterydata order by timestp desc limit 20 '; //for local DB
    connection.query(sql, function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.json(rows);
        } else {
            console.log('Error while performing Query.');
        }
    });
});


// get one item from id.
app.get("/chargedata", function(req, res) {
    // var sql = 'SELECT * FROM bms.batteryData where battery_status=1 and ch_cur >= 100 order by timestp desc limit 100';
    var sql = 'SELECT * FROM bms.batteryData where battery_status=1 order by timestp limit 8000';
    connection.query(sql, function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.json(rows);
        } else {
            console.log('Error while performing Query.');
        }
    });
});


// get one item from id.  ****************finished
app.get("/dischargedata", function(req, res) {
    //connection.connect();
    //var sql = 'SELECT * FROM bms.batteryData where battery_status=2 limit 8000';
    var sql = 'SELECT * FROM bms.batteryData where battery_status=2 limit 8000';//for local DB
    connection.query(sql, function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.json(rows);
        } else
            console.log('Error while performing Query.');
    });

    //connection.end();

});


app.get("/socdata", function(req, res) {
    var sql = 'SELECT * FROM bms.batteryData order by timestp desc';
    connection.query(sql, function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.json(rows);
        } else {
            console.log('Error while performing Query.');
        }
    });
});

app.get("/totalcharge", function(req, res) {
    // var sql = 'SELECT * FROM bms.batteryData where battery_status=1 and ch_cur >= 100 order by timestp desc limit 100';
    var sql = 'SELECT * FROM bms.batteryData order by timestp desc';
    connection.query(sql, function(err, rows, fields) {
        if (!err) {
            console.log('The solution is: ', rows);
            res.json(rows);
        } else {
            console.log('Error while performing Query.');
        }
    });
});


app.listen(3000);
console.log("Server is running on port 3000");
