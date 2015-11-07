var express      = require('express');
var path         = require('path');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var app = express();

app.use(express.static(path.join(__dirname, 'views')));
var server = require('http').Server(app);
var io     = require('socket.io')(server);
var routes = require('./server/routes/index');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client')));
app.use('/', routes);



var port = process.env.PORT || 8000;

server.listen(port, function() {
    console.log("Running on port", port);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}




module.exports = app;


//require('./routes/io.js')(app,io);






