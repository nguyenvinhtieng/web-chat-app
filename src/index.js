const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

var server = require("http").Server(app);
var io = require("socket.io")(server);

const port = process.env.PORT || 3000;
// my library
const route = require('./route/index');
const handleSocket = require('./socket/index')
// database
const db = require('./config/db/index');
db.connect();

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.urlencoded({
  extended: true,
}));
app.use(express.json());

//static file
app.use(express.static(path.join(__dirname, 'public')));
//engine
app.engine('hbs', handlebars({
  extname: '.hbs'
}));
app.set('view engine','hbs');
app.set('views', path.join(__dirname, 'views'));

// routes
route(app);

// run
server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})

handleSocket(io)