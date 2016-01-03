var fs = require('fs'),
  path = require('path'),
  Sequelize = require('sequelize'),
  lodash = require('lodash'),
  db = {},
  sequelize = null;

if (process.env.HEROKU_POSTGRESQL_BRONZE_URL) {
  // the application is executed on Heroku ... use the postgres database
  var match = process.env.HEROKU_POSTGRESQL_BRONZE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

  sequelize = new Sequelize(match[5], match[1], match[2], {
    dialect: 'postgres',
    protocol: 'postgres',
    port: match[4],
    host: match[3],
    logging: true //false
  })
} else {
  <% if (databaseType == 'sqlite'){%>
  sequelize = new Sequelize('<%= databaseName %>', '<%= userName %>', null, {
    dialect: "sqlite", // or 'sqlite', 'postgres', 'mariadb'
    storage: path.join(__dirname, "/../<%= databaseName %>"),
  })
  <% } else { %>
  sequelize = new Sequelize('<%= databaseName %>', '<%= userName %>',  '<%= password %>', {
    dialect: '<%= databaseType %>'
    host: '<%= hostName %>'
    port: '<%= port %>'
  })
  <% } %>
}

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
