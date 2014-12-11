var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  lodash = require('lodash'),
  db = {},
  sequelize = new Sequelize('example', 'example', null, {
    dialect: "sqlite", // or 'sqlite', 'postgres', 'mariadb'
    storage: "/tmp/example.db",
  })
  //sequelize = new Sequelize('example_sams', 'example', 'example', {
  //   dialect: 'mysql',
  //   host: "localhost",
  //   port: 3306
  // }),

fs.readdirSync(__dirname)
  .filter(function(file) {
    return ((file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) == '.js'))
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db)
  }
})

module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize
}, db)