
angular.module('<%= baseName %>')
  .factory('resource<%= _.classify(name) %>', ['$resource', function (a) {
    return a('<%= baseName %>/<%= name %>/:id', {}, {
      get: { method: 'GET'},
      update: { method: 'PUT'},
      query: { method: 'GET'},
      default: {<% _.each(attrs, function(attr){ %> '<%= _.camelCase(attr.attrName) %>': '',<%}); %> id: ''}
    });
  }]);
