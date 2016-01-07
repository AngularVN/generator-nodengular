'use strict';
// Declare app level module which depends on filters, and services
angular.module('<%= baseName %>', [
		'ngResource',
		'ngRoute',
		'ngCookies',
		"api.filters",
		"api.services",
		"api.directives",
		"api.controllers",
		'ui.bootstrap',
	])
	.constant("DOMAIN", "")
	.constant("API_KEY", "1234567890")
	.constant("SESSION_COOKIE_NAME", "session")
	.constant("DELAY", 5000)
	.constant("PERPAGE", [10, 20, 50, 100])
	.constant('ROLES', ['administrator', 'moderator', 'accounting', 'cashier', 'user'])
	.constant("DEFAULT_ROUTE", "/")
	.constant("REQUIRE_AUTH", "/signin")
	.constant("VERSION", "© 2014 fb.com/leduongcom")



.config([
	'$provide', '$httpProvider',
	function($provide, $httpProvider) {
		$httpProvider.defaults.headers.common = {
			"Accept": "application/json, text/plain, */*",
			"Content-Type": "application/json;charset=utf-8",
			"X-Requested-With": "XMLHttpRequest"
		};
		$provide.factory('ddInterceptor', [
			'$q', '$rootScope', '$injector', '$location', 'REQUIRE_AUTH',
			function($q, $rootScope, $injector, $location, REQUIRE_AUTH) {
				var currentPath, payloadData, ref;
				var exports = {
					response: function(response) {
						// do something on success
						if (response.headers()["content-type"] === "application/json") {
							if (response.data.code === 400) {
								$rootScope.$broadcast("error", response.data.message || "Error. 400 Bad Request.");
							} else if (response.data.code === 401) {
								$rootScope.$broadcast('error', response.data.message || 'Error. 401 Unauthorized.');
								$location.path(REQUIRE_AUTH);
								currentPath = $location.path();
								if (currentPath !== REQUIRE_AUTH || currentPath !== "/signout" || currentPath !== "/signup") {
									ref = $location.$$url;
									$location.path("/signout").search({
										ref: ref
									});
								}
							} else if (response.data.code === 403) {
								if ($location.path() !== REQUIRE_AUTH) {
									$rootScope.$broadcast("error", response.data.message || "Error. 403 Forbidden.");
									$location.path(REQUIRE_AUTH);
								}
							} else if (response.data.code === 404) {
								if ($location.path() !== REQUIRE_AUTH) {
									$rootScope.$broadcast("error", response.data.message || "Error. 404 Not Found.");
									$location.path(REQUIRE_AUTH);
								}
							}
							// return response;//return $q.reject(response);
						};
						return response;
					},
					responseError: function(response) {
						var currentPath, message = response.headers()['x-status-reason'] || 'Error. Your connection is having a problem';
						$rootScope.$broadcast('error', message);
						if (response.status === 401) {
							currentPath = $location.path();
							if (currentPath !== "/signout" && currentPath !== "/signin" && currentPath !== "/signup") {
								ref = $location.$$url;
								$location.path("/signout").search({
									ref: ref
								});
							}
						}
						return $q.reject(response);
						if (canRecover(response)) {
							return responseOrNewPromise
						}
						return $q.reject(response);
					}
				};
				return exports;
			}
		]);
		$httpProvider.interceptors.push('ddInterceptor');
	}
])

/**
 * [description]
 * @return {[type]}                   [description]
 */
.config([
	"$compileProvider",
	function($compileProvider) {
		return $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|tel|sms):/);
	}
])

/**
 * [description]
 * @return {[type]}                               [description]
 */
// .run([
// 	"$rootScope", "$location", "securityService", "REQUIRE_AUTH",
// 	function($rootScope, $location, securityService, REQUIRE_AUTH) {
// 		var skipAuth;
// 		skipAuth = ["/signin", "/signout", "/lock"];
// 		$rootScope.isPath = null;
// 		securityService.init();
// 		return $rootScope.$on("$routeChangeStart", function(event, next, current) {
// 			var isAuthenticated, query;
// 			isAuthenticated = void 0;
// 			query = void 0;
// 			$rootScope.isPath = $location.path();
// 			isAuthenticated = securityService.isAuthenticated();
// 			if (isAuthenticated) {
// 				query = $location.search();
// 				if (query.ref) {
// 					$location.search({}).path(query.ref);
// 				}
// 			} else {
// 				if (!_(skipAuth).contains($rootScope.isPath)) {
// 					$location.path(REQUIRE_AUTH);
// 				}
// 			}
// 		});
// 	}
// ])


/**
 * route homepage
 */
.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/dashboard', {
				templateUrl: 'views/home/home.html'
			})
			.when('/signin', {
				templateUrl: 'views/signin.html',
			})
			.when("/signout", {
				resolve: {
					logout: function($location, securityService) {
						securityService.destroySession();
						$location.path("/signin");
					}
				}
			})
			.otherwise({
				redirectTo: '/dashboard'
			});
	}
]);
