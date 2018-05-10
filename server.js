var fs = require("fs");
var http = require("http");
var https = require("https");
var privateKey = fs.readFileSync(__dirname + "/key.pem", "utf8");
var certificate = fs.readFileSync(__dirname + "/cert.pem", "utf8");
var path = require("path");

var credentials = { key: privateKey, cert: certificate };
var express = require("express");
var app = express();

app.set("port", process.env.PORT || 9090);


var aws = require('aws-sdk');
var ep = new aws.Endpoint('http://localhost:7480');
var getS3 = function() {
var s3Options = {
        server: "localhost",
        port: '7480',
        // headers: {'Access-Control-Allow-Origin': '*'},
        sslEnabled: false,
        s3ForcePathStyle: true,
        s3BucketEndpoint: false,
        endpoint: ep
    }
    return new aws.S3(s3Options);
};

app.use('/s3', require('react-s3-uploader/s3router')({
     getS3: getS3,
     bucket: "test-bucket",
     // region: 'us-east-1', //optional
     signatureVersion: 'v4', //optional (use for some amazon regions: frankfurt and others)
     headers: {'Access-Control-Allow-Origin': '*'}, // optional
     // ACL: 'private', // this is default
     uniquePrefix: false // (4.0.2 and above) default is true, setting the attribute to false preserves the original filename in S3
}));

app.use(function(req, res, next) {
  if (path.extname(req.path).length > 0) {
    next();
  } else if (path.dirname(req.path).indexOf("silent_renew") > -1) {
    req.url = "/silent_renew.html";
    next();
  } else if (path.dirname(req.path).indexOf("s3") > -1) {
    // skip?
    next();
  } else {
    req.url = "/index.html";
    next();
  }
});

app
  .use(express.static(__dirname + "/dist"))
  .get("/", function(req, res) {
    res.sendFile("index.html", {
      root: __dirname + "/dist"
    });
  })
  .get("/silent_renew.html", function(req, res) {
    res.sendFile("silent_renew.html", {
      root: __dirname + "/dist"
    });
  });

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(app.get("port"), function() {
  console.log("The server is listening on port", app.get("port"));
});
