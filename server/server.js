const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

const { main, user } = require('./routes');

const app = express();

// set views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// load middlewares
app.use('/src', express.static(path.join(__dirname, '../client/src')));
app.use('/scripts', express.static(path.join(__dirname, '../client/node_modules')));

app.use([
    bodyParser.json(), 
    bodyParser.urlencoded({ extended: false })
]);

// load routes
app.use('/', main);
app.use('/user', user);

// handlebars config
hbs.registerPartials(path.join(__dirname, '/views/partials/'));


app.listen(
    process.env.PORT || 3000,
    () => console.log('Listening...')
);