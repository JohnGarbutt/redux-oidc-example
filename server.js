var express = require('express');
var path = require('path');
var webpack = require('webpack');
var app = express();

var isDevelopment = (process.env.NODE_ENV !== 'production');
var static_path = path.join(__dirname, 'public');

app.use(function(request, response, next) {
  if (path.extname(request.path).length > 0) {
    next();
  } else {
    request.url = '/index.html';
    next();
  }
});

app.use(express.static(static_path))
  .get('/', function (req, res) {
    res.sendFile('dist/index.html', {
      root: static_path
    });
  }).listen(process.env.PORT || 8080, function (err) {
    if (err) { console.log(err) };
    console.log('Listening at localhost:8080');

});

if (isDevelopment) {
  var config = require('./webpack-dev-server.config');
  var WebpackDevServer = require('webpack-dev-server');

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true
  }).listen(3000, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:3000');
  });
}