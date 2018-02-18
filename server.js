// server.js
const express = require('express');
const compression = require('compression');
const mongoskin = require('mongoskin');
const bodyParser = require('body-parser');
const logger = require('morgan');
const http = require('http');

const app = express();

app.use(bodyParser.json());
app.use(logger());
app.use(compression());

app.param('id', (req, res, next, id) => {
  req.id = id;
  return next()
})

const db = mongoskin.db('mongodb://love1024:Lsvwsan9@ds237868.mlab.com:37868/abc');
const id = mongoskin.helper.toObjectID

const collection = db.collection('abc');
const tileCollection = db.collection('tile');
// Run the app by serving the static files
// in the dist directory


app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port

//MONGO DB SERVER REQUESTS

app.get('/', (req, res, next) => {
  collection.find({}, { limit: 10, sort: [['_id', -1]] })
    .toArray((err, results) => {
      if (err)
        return next(err);
      res.send(results);
    }
    );
});

app.get('/db/tiles', (req, res, next) => {
  tileCollection.find({}, { limit: 10, sort: [['_id', -1]] })
    .toArray((err, results) => {
      if (err)
        return next(err);
      res.send(results);
    }
    );
});

app.get('/db/:id', (req, res, next) => {
  collection.find({ _id: id(req.id) })
    .toArray((err, results) => {
      if (err)
        return next(err);
      res.send(results);
    }
    );
});

//To store whole blog
app.post('/db', (req, res, next) => {
  collection.insert(req.body, {}, (err, results) => {
    if (err)
      return next(err);
    res.send(results.ops);
  })
});

//To store tile of general information about blogs
app.post('/db/tile', (req, res, next) => {
  tileCollection.insert(req.body, {}, (err, results) => {
    if (err)
      return next(err);
    res.send(results.ops);
  })
})


app.listen(process.env.PORT || 8080);
