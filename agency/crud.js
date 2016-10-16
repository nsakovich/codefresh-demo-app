'use strict';

var express = require('express');
var router = express.Router();
var models = require('../models');
var Promise = require('bluebird');

var agencyAssociation = {
  model: models.Agency,
  as: 'agencies'
};

var tagsAssociation = {
  model: models.Tag,
  as: 'tags',
  attributes: ['name']
};

router.post('/agencies', (req, res) => {
  var agency = req.body;
  var error = (err) => res.status(500).send({ message: err.message });
  // get tags array from string
  var agencyTags = agency.tags.split(',').map((tag) => tag.trim()).filter(tag => tag !== '');

  var createAgency = (tags) => {
    // create agency
    return models.Agency.create(agency).then((agency) => {
      // add tags to agency
      return agency.addTags(tags).then(() => {
        // reload agency and respond with all data
        return models.Agency.findById(agency.id, { include: [tagsAssociation] }).then((agency) => {
          res.status(200).send(agency);
        }).catch(error);
      }).catch(error);
    }).catch(error);
  };

  // finding already existed tags
  models.Tag.findAll({ where: { name: { $in: agencyTags }}}).then((existedTags) => {
    // filter and get a new tags names
    var existedNames = existedTags.map((tag) => tag.name);
    var newTagNames = agencyTags.filter(tag => existedNames.indexOf(tag) < 0);
    var createNotExisted = [];

    newTagNames.forEach(name => createNotExisted.push(models.Tag.create({ name })));

    // create new tags and go to agency creation after this
    return Promise.all(createNotExisted).then((createdTags) => createAgency(existedTags.concat(createdTags))).catch(error);
  }).catch(error);

});

router.get('/agencies', (req, res) => {
  var where = {};
  var order = 'grade';

  var success = (agencies) => res.status(200).send(agencies);
  var error = (err) => res.status(500).send({ message: err.message });

  // add name in filter if needed
  if (req.query.name) {
    where.name = { $like: `%${req.query.name}%` };
  }

  if (req.query.tag) {
    // if tag in filter first of all try to find tag
    models.Tag.findOne({ include: [agencyAssociation], where: { name: req.query.tag } }).then((tag) => {
      if (tag) {
        // if tag exists return agencies associated with this tag. Includes name filter if needed.
        return tag.getAgencies({ where: where, include: [tagsAssociation], order: order }).then(success).catch(error);
      } else {
        success([]); // return empty array if tag was not found
      }
    }).catch(error);
  } else {
    // return all agencies or filter by name only
    return models.Agency.findAll({ include: [tagsAssociation], where: where, order: order }).then(success).catch(error);
  }

});

module.exports = router;
