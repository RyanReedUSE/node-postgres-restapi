/* global require */
const promise = require('bluebird');

const options = {
  // Initialization Options
  promiseLib: promise
};

const pgp = require('pg-promise')(options);
const connectionString =
  'postgres://vufgcemioldqee:f1f1d03b4a8ea58e2807945c2b5e2d366ab53983ca64abfbf5a0e32f8f97aa1b@ec2-54-204-44-140.compute-1.amazonaws.com:5432/d40ucbv3hf5elp?ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory';

const db = pgp(connectionString);

// ///////////////////
// Query Functions
// ///////////////////

function getAllStarships(req, res, next) {
  'use strict';
  console.log(db.connect);
  db
    .any('SELECT * FROM starships')
    .then(function(data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all starships'
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function getStarship(req, res, next) {
  let id = parseInt(req.params.id);
  db
    .one('SELECT * FROM starships WHERE id = $1', id)
    .then(function(data) {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved one starship'
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function createStarship(req, res, next) {
  req.body.launched = parseInt(req.body.launched);
  db
    .none(
      'INSERT INTO starships(name, registry, affiliation, launched, class, captain)' +
        'values(${name}, ${registry}, ${affiliation}, ${launched}, ${class}, ${captain})',
      req.body
    )
    .then(function() {
      res.status(200).json({
        status: 'success',
        message: 'Inserted one starship'
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function updateStarship(req, res, next) {
  db
    .none(
      'UPDATE starships SET name=$1, registry=$2, affiliation=$3, launched=$4, class=$5, captain=$6 where id=$7',
      [
        req.body.name,
        req.body.registry,
        req.body.affiliation,
        parseInt(req.body.launched),
        req.body.class,
        parseInt(req.params.id)
      ]
    )
    .then(function() {
      res.status(200).json({
        status: 'success',
        message: 'Updated starship'
      });
    })
    .catch(function(err) {
      return next(err);
    });
}

function removeStarship(req, res, next) {
  let id = parseInt(req.params.id);
  db
    .result('DELETE FROM starships WHERE id = $1', id)
    .then(function(result) {
      /* jshint ignore:start */
      res.status(200).json({
        status: 'success',
        message: `Removed ${result.rowCount} starships`
      });
      /* jshint ignore:end */
    })
    .catch(function(err) {
      return next(err);
    });
}

// ///////////
// Exports
// ///////////

module.exports = {
  getAllStarships: getAllStarships,
  getStarship: getStarship,
  createStarship: createStarship,
  updateStarship: updateStarship,
  removeStarship: removeStarship
};
