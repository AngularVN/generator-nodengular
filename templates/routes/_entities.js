/**
 * @swagger
 * resourcePath: /<%= _.capitalize(name) %>
 * description: All <%= _.capitalize(name) %> API
 */

var db = require('../models'),
  _ = require('lodash');


/**
 * @swagger
 * path: /<%= baseName %>/<%= name %>
 * operations:
 *   -  httpMethod: GET
 *      summary: Get list of <%= _.capitalize(name) %>
 *      responseClass: <%= _.capitalize(name) %>
 *      consumes:
 *        - application/json
 */
 exports.findAll = function(req, res) {
  var q = req.query.q || "",
    sort = req.query.sort || "id",
    order = req.query.order || "asc",
    page = parseInt(req.query.page) || 1,
    limit = parseInt(req.query.limit) || 20,
    group = req.query.group || "",
    offset = ((page - 1) * limit),
    query = {
      order: sort + ' ' + order,
      offset: offset,
      limit: limit
    };

  if (group) {
    query = _.merge({
      group: group
    }, query);
  };

  if (q) {
    query = _.extend({<% var concat = []; _.each(attrs, function (attr) {
      if (attr.attrType === "String" || attr.attrType === "Char" || attr.attrType === "Text") {
        concat.push(_.camelCase(attr.attrName));
      }
    });%>
    where: ["CONCAT(<%= concat.join(', ') %>) LIKE '%" + q + "%'"]
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

/**
 * @swagger
 * path: /<%= baseName %>/<%= name %>/{id}
 * operations:
 *   -  httpMethod: GET
 *      summary: Find a <%= _.capitalize(name) %> by ID
 *      responseClass: <%= _.capitalize(name) %>
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: id
 *          paramType: path
 *          type: integer
 *          required: true
 *          description: ID of <%= _.capitalize(name) %>
 */
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


/**
 * @swagger
 * path: /<%= baseName %>/<%= name %>
 * operations:
 *   -  httpMethod: POST
 *      summary: Add a new <%= _.capitalize(name) %>
 *      responseClass: <%= _.capitalize(name) %>
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      responseMessages:
 *        201:
 *          description: "Success"
 *        405:
 *          description: "Invalid input"
 *      parameters:
 *        - name: body
 *          description: object of <%= _.capitalize(name) %>
 *          paramType: body
 *          required: true
 *          type: <%= _.capitalize(name) %>
 */
exports.create = function(req, res) {
  db.<%= _.capitalize(name) %>.create(req.body).success(function(entity) {
    res.statusCode = 201
    res.json(entity)
  })
}


/**
 * @swagger
 * path: /<%= baseName %>/<%= name %>/{id}
 * operations:
 *   -  httpMethod: PUT
 *      summary: Update an existing <%= _.capitalize(name) %> by ID
 *      responseClass: <%= _.capitalize(name) %>
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      responseMessages:
 *        200:
 *          description: "Success"
 *        404:
 *          description: "Not found"
 *        405:
 *          description: "Invalid input"
 *      parameters:
 *        - name: id
 *          type: integer
 *          required: true
 *          paramType: path
 *          description: ID of <%= _.capitalize(name) %>
 *        - name: body
 *          description: object of <%= _.capitalize(name) %>
 *          paramType: body
 *          required: true
 *          type: <%= _.capitalize(name) %>
 */
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


/**
 * @swagger
 * path: /<%= baseName %>/<%= name %>/{id}
 * operations:
 *   -  httpMethod: DELETE
 *      summary: Delete a <%= _.capitalize(name) %> by ID
 *      consumes:
 *        - application/json
 *      responseMessages:
 *        204:
 *          description: "Success"
 *        404:
 *          description: "Not found"
 *      parameters:
 *        - name: id
 *          type: integer
 *          paramType: path
 *          required: true
 *          description: ID of <%= _.capitalize(name) %>
 */
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

/**
 * @swagger
 * models:
 *   <%= _.capitalize(name) %>:
 *     type: object
 *     properties:
 <% _.each(attrs, function (attr) { %>*       <%= _.camelCase(attr.attrName) %>:
 *         type: <%= _.capitalize(attr.attrType) %>
 <% }); %>*/
