const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const exphbs = require('express-handlebars');
const path = require('path');

const { mainRoute, userRoute } = require('./routes');

const app = express();
const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    defaultLayout: 'main',
    partialsDir: 'views/partials/'
});
// set views
app.engine('.hbs', hbs.engine);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// load middlewares
app.use('/src', express.static(path.join(__dirname, '../client/src')));
app.use('/scripts', express.static(path.join(__dirname, '../client/node_modules')));
app.use(cors());
app.use(bodyParser.json());
// load routes
app.use('/', mainRoute);
app.use('/user', userRoute);

app.listen(
    process.env.PORT || 3000,
    () => console.log('Listening...')
);

