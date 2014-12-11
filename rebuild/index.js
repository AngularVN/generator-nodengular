'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');


var NodengularGenerator = yeoman.generators.NamedBase.extend({
  initializing: function() {
    this.log('You called the nodengular subgenerator with the argument ' + this.name + '.');
  },

  writing: function() {
    this.src.copy('somefile.js', 'somefile.js');
  }
});


var NodengularGenerator = function NodengularGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function() {
    this.installDependencies({
      skipInstall: options['skip-install']
    });

    if (this.generatorConfig.databaseType === 'sqlite') {
      this.spawnCommand('sqlite3', ['-line', this.generatorConfig.databaseName, 'select 1']);
    }

  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(NodengularGenerator, yeoman.generators.Base);

NodengularGenerator.prototype.rebuild = function rebuild() {
  this.generatorConfig = this.dest.readJSON('generator.json');
  this.baseURL = this.generatorConfig.baseURL;
  this.baseName = this.generatorConfig.baseName;
  this.databaseType = this.generatorConfig.databaseType;
  this.hostName = this.generatorConfig.hostName;
  this.databaseName = this.generatorConfig.databaseName;
  this.userName = this.generatorConfig.userName;
  this.password = this.generatorConfig.password;
  this.entities = this.generatorConfig.entities;
  this.authenticate = this.generatorConfig.authenticate;
  this.composer = this.generatorConfig.composer;
  this.pluralize = pluralize;
  this._s = _s;
  var folders = [
    'public',
    'models',
    'routes',
    'views',
    'docs',
    'source',
    'source/js',
    'source/views',
    'source/views/home',
    'source/styles-less',
  ];

  var files = [
    'package.json',
    'bower.json',
    'composer.json',
    'GruntFile.coffee',
    '.editorconfig',
    '.gitignore',
    '.jshintrc',
    '.bowerrc',
  ];
  var template = '../../templates/';
  var sourceJsDir = 'source/js/';
  var sourceLessDir = 'source/styles-less/';
  var self = this;
  folders.forEach(function(folder) {
    self.mkdir(folder);
  });

  files.forEach(function(file) {
    self.copy(template + file, file);
  });
  this.template(template + '_app.js', 'app.js');
  this.template(template + 'models/_index.js', 'models/index.js');

  this.template(template + 'client/styles-less/_common.less', sourceLessDir + 'common.less');
  this.template(template + 'client/styles-less/_app.less', sourceLessDir + 'app.less');

  // combo
  this.template(template + 'client/js/_app.js', sourceJsDir + 'app.js');
  this.template(template + 'client/js/_filters.js', sourceJsDir + 'filters.js');
  this.template(template + 'client/js/_services.js', sourceJsDir + 'services.js');
  this.template(template + 'client/js/_directives.js', sourceJsDir + 'directives.js');
  this.template(template + 'client/js/_controllers.js', sourceJsDir + 'controllers.js');
  this.template(template + 'client/js/home/_home-controller.js', sourceJsDir + 'home/home-controller.js');

  this.template(template + 'client/htaccess', 'source/.htaccess');
  this.template(template + 'client/_index.html', 'source/index.html');
  this.template(template + 'client/views/_nav.html', 'source/views/nav.html');
  this.template(template + 'client/views/_flash.html', 'source/views/flash.html');
  this.template(template + 'client/views/_header.html', 'source/views/header.html');
  this.template(template + 'client/views/_signin.html', 'source/views/signin.html');
  this.template(template + 'client/views/home/_home.html', 'source/views/home/_home.html');

  _.each(this.entities, function(entity) {
    this.name = entity.name;
    this.attrs = entity.attrs;

    var sourceEntityJsDir = sourceJsDir + entity.name + '/';
    var sourceEntityViewDir = 'source/views/' + entity.name + '/';
    this.mkdir(sourceEntityJsDir);
    this.mkdir(sourceEntityViewDir);

    this.template(template + 'models/_entity.js', 'models/' + entity.name.toLowerCase() + '.js');
    this.template(template + 'routes/_entities.js', 'routes/' + pluralize(entity.name) + '.js');

    this.template(template + 'client/styles-less/_model.less', sourceLessDir + entity.name.toLowerCase() + '.less');
    this.template(template + 'client/js/_model-controller.js', sourceEntityJsDir + entity.name + '-controller.js');
    this.template(template + 'client/js/_model-router.js', sourceEntityJsDir + entity.name + '-router.js');
    this.template(template + 'client/js/_model-service.js', sourceEntityJsDir + entity.name + '-service.js');
    this.template(template + 'client/views/_models.html', sourceEntityViewDir + pluralize(entity.name) + '.html');
    this.template(template + 'client/views/_model-modal.html', sourceEntityViewDir + entity.name + '-modal.html');
  }.bind(this));
};

module.exports = NodengularGenerator;