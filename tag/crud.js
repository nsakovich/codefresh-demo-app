'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models');

router.get('/tags', (req, res) => {
  models.Tag.findAll({
    where: {
      name: { $like: `%${req.query.name}%` }
    },
    limit: 10
  }).then((tags) => {
    res.status(200).send(tags);
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
});

module.exports = router;
