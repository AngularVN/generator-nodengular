'use strict';
var util = require('util'),
  path = require('path'),
  yeoman = require('yeoman-generator'),
  yosay = require('yosay'),
  fs = require('fs'),
  _ = require('lodash'),
  _s = require('underscore.string'),
  pluralize = require('pluralize'),
  asciify = require('asciify');

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
    'source/img',
    'source/views',
    'source/views/home',
    'source/styles-less',
  ];

  var files = [
    '.bowerrc',
    '.jshintrc',
    '.gitignore',
    'bower.json',
    'package.json',
    '.editorconfig',
    'GruntFile.coffee',
  ];
  var tpl = '../../templates/';
  var sourceJsDir = 'source/js/';
  var sourceLessDir = 'source/styles-less/';
  var self = this;
  folders.forEach(function(folder) {
    self.mkdir(folder);
  });

  files.forEach(function(file) {
    self.template(tpl + file, file);
  });

  self.copy(tpl + 'client/img/avatar.jpg', 'source/img/avatar.jpg');
  self.copy(tpl + 'client/img/checkmark.png', 'source/img/checkmark.png');

  this.template(tpl + '_app.js', 'app.js');
  this.template(tpl + 'models/_index.js', 'models/index.js');

  this.template(tpl + 'client/styles-less/_common.less', sourceLessDir + 'common.less');
  this.template(tpl + 'client/styles-less/_app.less', sourceLessDir + 'app.less');

  // combo
  this.template(tpl + 'client/js/_app.js', sourceJsDir + 'app.js');
  this.template(tpl + 'client/js/_filters.js', sourceJsDir + 'filters.js');
  this.template(tpl + 'client/js/_services.js', sourceJsDir + 'services.js');
  this.template(tpl + 'client/js/_directives.js', sourceJsDir + 'directives.js');
  this.template(tpl + 'client/js/_controllers.js', sourceJsDir + 'controllers.js');
  this.template(tpl + 'client/js/home/_home-controller.js', sourceJsDir + 'home/home-controller.js');

  this.template(tpl + 'client/htaccess', 'source/.htaccess');
  this.template(tpl + 'client/_index.html', 'source/index.html');
  this.template(tpl + 'client/views/_nav.html', 'source/views/nav.html');
  this.template(tpl + 'client/views/_flash.html', 'source/views/flash.html');
  this.template(tpl + 'client/views/_header.html', 'source/views/header.html');
  this.template(tpl + 'client/views/_signin.html', 'source/views/signin.html');
  this.template(tpl + 'client/views/home/_home.html', 'source/views/home/home.html');

  _.each(this.entities, function(entity) {
    this.name = entity.name;
    this.attrs = entity.attrs;

    var sourceEntityJsDir = sourceJsDir + entity.name + '/';
    var sourceEntityViewDir = 'source/views/' + entity.name + '/';
    this.mkdir(sourceEntityJsDir);
    this.mkdir(sourceEntityViewDir);

    this.template(tpl + 'models/_entity.js', 'models/' + entity.name.toLowerCase() + '.js');
    this.template(tpl + 'routes/_entities.js', 'routes/' + pluralize(entity.name) + '.js');

    this.template(tpl + 'client/styles-less/_model.less', sourceLessDir + entity.name.toLowerCase() + '.less');
    this.template(tpl + 'client/js/_model-controller.js', sourceEntityJsDir + entity.name + '-controller.js');
    this.template(tpl + 'client/js/_model-router.js', sourceEntityJsDir + entity.name + '-router.js');
    this.template(tpl + 'client/js/_model-service.js', sourceEntityJsDir + entity.name + '-service.js');
    this.template(tpl + 'client/views/_models.html', sourceEntityViewDir + pluralize(entity.name) + '.html');
    this.template(tpl + 'client/views/_model-modal.html', sourceEntityViewDir + entity.name + '-modal.html');
  }.bind(this));
};

module.exports = NodengularGenerator;