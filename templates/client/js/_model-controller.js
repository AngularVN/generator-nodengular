angular.module('<%= baseName %>').

controller('<%= _.classify(name) %>Ctrl', [
  '$scope', '$location', 'resource<%= _.classify(name) %>', '<%= name %>',
  function($scope, $location, resource<%= _.classify(name) %>, <%= name %>) {
    $scope.<%= name %> = <%= name %>;

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.submit = function() {
      if ($scope.<%= name %>.id) {
        resource<%= _.classify(name) %>.update({
            id: id
          }, $scope.<%= name %>,
          function() {
            $location.path('/<%= pluralize(name)%>');
          });
      } else {
        resource<%= _.classify(name) %>.save($scope.<%= name %>,
          function() {
            $location.path('/<%= pluralize(name)%>');
          });
      }
    };

    $scope.dismiss = function() {
      $scope.<%= name %> = <%= name %>;
    };

  }
]).


controller('<%= _.classify(pluralize(name)) %>Ctrl', [
  '$scope', '$modal', '$location', 'PERPAGE', 'resolved<%= _.classify(name) %>', 'resource<%= _.classify(name) %>',
  function($scope, $modal, $location, PERPAGE, resolved<%= _.classify(name) %>, resource<%= _.classify(name) %> ){
    $scope.perpage = PERPAGE;
    $scope.q = $location.search().q || '';
    $scope.sort = $location.search().sort || '';
    $scope.order = $location.search().order || '';
    $scope.limit = $location.search().limit || 20;

    $scope.items = resolved<%= _.classify(name) %>;

    $scope.create = function(){
      $scope.clear();
      $scope.open();
    };

    $scope.update = function(id){
      $scope.<%= name %> = resource<%= _.classify(name) %>.get({
        id: id
      });
      $scope.open(id);
    };

    $scope.delete = function(id){
      var x = confirm('Are you sure you want to delete <%= _.classify(name) %>?');
      if (x) {
        resource<%= _.classify(name) %>.delete({
          id: id
        }, function(){
          $scope.items = resource<%= _.classify(name) %>.query();
        });
      }
    };

    $scope.clear = function(){
      $scope.<%= name %> = resource<%= _.classify(name) %>.default();
    };

    $scope.open = function(id){
      var modal = $modal.open({
        templateUrl: 'views/<%= name %>/<%= name %>-modal.html',
        controller: ['$scope', '$modalInstance', '<%= name %>', 'resource<%= _.classify(name) %>',
          function($scope, $modalInstance, <%= name %>, resource<%= _.classify(name) %>){
            $scope.<%= name %> = <%= name %>;
            $scope.submit = function() {
              if (id) {
                resource<%= _.classify(name) %>.update({
                    id: id
                  }, $scope.<%= name %>,
                  function() {
                    $modalInstance.close($scope.<%= name %>);
                  });
              } else {
                resource<%= _.classify(name) %>.save($scope.<%= name %>,
                  function() {
                    $modalInstance.close($scope.<%= name %>);
                  });
              }
            };
            $scope.dismiss = function(){
              $modalInstance.dismiss('dismiss');
            };
          }],
        resolve: { <%= name %> : function(){ return $scope.<%= name %>;}}
      });

      modal.result.then(function(entity) {
        if (entity) {
          $scope.items = resource<%= _.classify(name) %>.query();
          $scope.clear();
        }
      });
    };

    $scope.show = function(limit){
      $scope.limit = limit;
      $scope.items = resource<%= _.classify(name) %>.query({
        limit: limit,
        q: $scope.q || ''
      });
    };

    $scope.page = function(page){
      $scope.items = resource<%= _.classify(name) %>.query({
        page: page,
        limit: $scope.limit || 20,
        q: $scope.q || ''
      });
    };

    $scope.search = function(){
      $scope.items = resource<%= _.classify(name) %>.query({
        page: 1,
        limit: $scope.limit || 20,
        q: $scope.q || ''
      });
    };
  }
]);
