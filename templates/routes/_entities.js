var db = require('../models')

exports.findAll = function(req, res) {
  var page = parseInt(req.query.page) || 1;
  var limit = parseInt(req.query.limit) || 20;
  db.<%= _.capitalize(name) %>.findAll({ offset: ((page-1) * limit), limit: limit })
    .success(function(entities) {
        res.jsonp({
          page: page,
          limit: limit,
          result: entities
        });
    })
}

exports.find = function(req, res) {
  db.<%= _.capitalize(name) %>.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      res.json(entity)
    } else {
      res.send(404)
    }
  })
}

exports.create = function(req, res) {
  db.<%= _.capitalize(name) %>.create(req.body).success(function(entity) {
    res.statusCode = 201
    res.json(entity)
  })
}

exports.update = function(req, res) {
  db.<%= _.capitalize(name) %>.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      entity.updateAttributes(req.body).success(function(entity) {
        res.json(entity)
      })
    } else {
      res.send(404)
    }
  })
}

exports.destroy = function(req, res) {
  db.<%= _.capitalize(name) %>.find({ where: { id: req.param('id') } }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  })
}