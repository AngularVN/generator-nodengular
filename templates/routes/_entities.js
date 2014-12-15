var db = require('../models'),
  _ = require('lodash');

exports.findAll = function(req, res) {
  var q = req.query.q || "",
    sort = req.query.sort || "id",
    order = req.query.order || "asc",
    page = parseInt(req.query.page) || 1,
    limit = parseInt(req.query.limit) || 20,
    group = req.query.group || "",
    offset = ((page - 1) * limit),
    query = {
      sort: sort,
      order: order,
      offset: offset,
      limit: limit
    };

  if (group) {
    query = _.merge({
      group: group
    }, query);
  };

  if (q) {
    query = _.merge({
      // where: ["name LIKE '%" + q + "%'"] // uncomment for use
    }, query);
  };

  db.<%= _.capitalize(name) %>.findAndCountAll(query)
    .success(function(result) {
      res.jsonp({
        total: result.count,
        page: page,
        limit: limit,
        from: offset + 1,
        to: offset + result.rows.length,
        results: result.rows
      });
    })
}

exports.find = function(req, res) {
  db.<%= _.capitalize(name) %>.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
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
  db.<%= _.capitalize(name) %>.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
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
  db.<%= _.capitalize(name) %>.find({
    where: {
      id: req.param('id')
    }
  }).success(function(entity) {
    if (entity) {
      entity.destroy().success(function() {
        res.send(204)
      })
    } else {
      res.send(404)
    }
  })
}