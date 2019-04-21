const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/config');

const middlewares = require('./routes/utils/middleware');


const app = express();

const options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

mongoose.Promise = require('q').Promise;
mongoose.connect(config.MONGODB_URI, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

const handleCorsHeaders = function (req, res, next) {
    if (req.get("Origin") != null)
    {
        res.header('Access-Control-Allow-Origin', req.get('Origin'));
        res.header('Access-Control-Allow-Credentials', 'true');
        if (req.get('Access-Control-Request-Method')) {
            res.header('Access-Control-Allow-Methods', req.get('Access-Control-Request-Method'));
        }
        if (req.get('Access-Control-Request-Headers')) {
            res.header('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers'));
        }
        if (req.method === 'OPTIONS') {
            res.status(200).send();
        } else {
            next()
        }
    } else {
        next()
    }
};

app.use(handleCorsHeaders);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(middlewares.validateAccess);

app.get('/', function(req, res, next) {
  res.render('index', { title: 'Workast-Backend' });
});

// catch 404 and forward to error handler
app.use(middlewares.notFound);

// error handler
app.use(middlewares.processError);

function getPort(){
	return process.env.PORT || 3000;
}

const port = getPort();

app.listen(port)

module.exports = app;