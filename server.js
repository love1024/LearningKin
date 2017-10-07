// server.js
const express = require('express');
const compression = require('compression');

const app = express();
app.use(compression());
// Run the app by serving the static files
// in the dist directory

// app.get('/', function (req, res) {
//   res.redirect('https://angular-blog-creator.herokuapp.com/index.html');
// })

app.use(express.static(__dirname + '/dist'));
// Start the app by listening on the default
// Heroku port

app.listen(process.env.PORT || 8080);
