var wikiRouter = require("./routes/wiki.js");
var express = require("express");
var app = express();
var swig = require('swig'),
    bodyParser = require('body-parser'),
		morgan = require("morgan"),
    urlEncoder = app.use(bodyParser.urlencoded({ extended: true })),
    jsonEncoder = app.use(bodyParser.json());

require("./filters")(swig);

app.use(morgan('dev'));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
swig.setDefaults({ cache: false });

app.use(express.static(__dirname + '/public'));
app.use("/wiki", wikiRouter);

app.listen(3000);
