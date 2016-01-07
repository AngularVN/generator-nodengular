angular.module('<%= baseName %>')
  .config(['$routeProvider', function(a) {
    a.
    when('/<%= name %>/<%= pluralize(name) %>', {
        templateUrl: 'views/<%= name %>/<%= pluralize(name) %>.html',
        controller: '<%= _.classify(pluralize(name)) %>Ctrl',
        resolve: {
          resolved<%= _.classify(name) %> : ['resource<%= _.classify(name) %>', function(a) {
            return a.query();
          }]
        }
      }).
    when('/<%= name %>/:id', {
    templateUrl: 'views/<%= name %>/<%= name %>.html',
    controller: '<%= _.classify(name) %>Ctrl',
    resolve: {
      <%= name %>: ['resource<%= _.classify(name) %>', '$route', function(a, b) {
        return (parseInt(b.current.params.id) > 0) ? a.get({
          id: b.current.params.id
        }) : a.default();
      }]
    }
  })
  }]);
