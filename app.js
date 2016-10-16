'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var conf = require('./conf');
var models = require('./models');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.status(200).send('Hello World');
});

app.use(express.static('./public'));
app.use('/api/i18n', (req, res) => {
  res.sendFile('public/locales/en.json', { root: __dirname });
});

app.use('/api', require('./agency/crud'));
app.use('/api', require('./tag/crud'));

app.set('port', conf.port);

models.sequelize.sync().then(() => {
  app.listen(process.env.PORT || app.get('port'), () => {
    console.log(`Express server listening on port ${app.get('port')}`);
  });
});
