/**
 * common Directives
 */
angular.module("<%= baseName %>.directives", [])

/**
 * [description]
 * [required] jquery maskinput
 * @return {[type]} [description]
 */
.directive("maskinput", function() {
	return {
		restrict: "A",
		link: function(scope, element, attr) {
			element.inputmask();
		}
	};
})

/**
 * [description]
 * Destroy Auth
 */
.directive("logOut", [
	"$location", "securityService", "DEFAULT_ROUTE",
	function($location, securityService, DEFAULT_ROUTE) {
		return function(scope, element, attrs) {
			element.bind("click", function() {
				securityService.destroySession();
				scope.$apply(function() {
					$location.path(DEFAULT_ROUTE);
				});
			});
		};
	}
])

/**
 * [description]
 * Lock Page
 */
.directive("lockPage", [
	"$location", "securityService", "DEFAULT_ROUTE",
	function($location, securityService, DEFAULT_ROUTE) {
		return function(scope, element, attrs) {
			var ref;
			ref = $location.$$url;
			element.bind("click", function() {
				securityService.destroySession();
				scope.$apply(function() {
					$location.path("/user/lock").search({
						ref: ref
					});
				});
			});
		};
	}
])

/**
 * [description]
 * @param  {[type]} link
 * Goto url link
 */
.directive("goClick", [
	"$location",
	function($location) {
		return function(scope, element, attrs) {
			var path;
			path = void 0;
			attrs.$observe("goClick", function(val) {
				path = val;
			});
			return element.bind("click", function() {
				scope.$apply(function() {
					$location.path(path);
				});
			});
		};
	}
])

/**
 * [description]
 * @return {[type]} [description]
 */
.directive("imgOnLoad", function() {
	return {
		restrict: "C",
		link: function(scope, element, attrs) {
			element.bind("load", function(e) {
				element.addClass("loaded");
			});
		}
	};
})

/**
 * [description]
 * imgHolder
 * @return {[type]}                  [description]
 */
.directive('imgHolder', [

	function() {
		return {
			restrict: 'A',
			link: function(scope, ele, attrs) {
				return Holder.run({
					images: ele[0]
				});
			}
		};
	}
])

/**
 * [description]
 * change background
 * @return {[type]} [description]
 */
.directive('customBackground', function() {
	return {
		restrict: "A",
		controller: [
			'$scope', '$element', '$location',
			function($scope, $element, $location) {
				var addBg, path;
				path = function() {
					return $location.path();
				};
				addBg = function(path) {
					$element.removeClass('body-home body-special body-tasks body-lock');
					switch (path) {
						case '/':
							return $element.addClass('body-home');
						case '/404':
						case '/500':
						case '/signin':
						case '/signup':
						case '/forgot':
							return $element.addClass('body-special');
						case '/lock':
							return $element.addClass('body-special body-lock');
						case '/tasks':
							return $element.addClass('body-tasks');
					}
				};
				addBg($location.path());
				return $scope.$watch(path, function(newVal, oldVal) {
					if (newVal === oldVal) {
						return;
					}
					return addBg($location.path());
				});
			}
		]
	};
})

/**
 * [description]
 * UI Color Switch
 * @return {[type]}                   [description]
 */
.directive('uiColorSwitch', [

	function() {
		return {
			restrict: 'A',
			link: function(scope, ele, attrs) {
				return ele.find('.color-option').on('click', function(event) {
					var $this, hrefUrl, style;
					$this = $(this);
					hrefUrl = void 0;
					style = $this.data('style');
					if (style === 'loulou') {
						hrefUrl = 'styles/main.css';
						$('link[href^="styles/main"]').attr('href', hrefUrl);
					} else if (style) {
						style = '-' + style;
						hrefUrl = 'styles/main' + style + '.css';
						$('link[href^="styles/main"]').attr('href', hrefUrl);
					} else {
						return false;
					}
					return event.preventDefault();
				});
			}
		};
	}
])

/**
 * [description]
 * toggleMinNav
 * @return {[type]}                      [description]
 */
.directive('toggleMinNav', [
	'$rootScope',
	function($rootScope) {
		return {
			restrict: 'A',
			link: function(scope, ele, attrs) {
				var $content, $nav, $window, Timer, app, updateClass;
				app = $('#app');
				$window = $(window);
				$nav = $('#nav-container');
				$content = $('#content');
				ele.on('click', function(e) {
					if (app.hasClass('nav-min')) {
						app.removeClass('nav-min');
					} else {
						app.addClass('nav-min');
						$rootScope.$broadcast('minNav:enabled');
					}
					return e.preventDefault();
				});
				Timer = void 0;
				updateClass = function() {
					var width;
					width = $window.width();
					if (width < 768) {
						return app.removeClass('nav-min');
					}
				};
				return $window.resize(function() {
					var t;
					clearTimeout(t);
					return t = setTimeout(updateClass, 300);
				});
			}
		};
	}
])

/**
 * [description]
 * collapse NAV
 * @return {[type]}                 [description]
 */
.directive('collapseNav', [

	function() {
		return {
			restrict: 'A',
			link: function(scope, ele, attrs) {
				var $a, $aRest, $lists, $listsRest, app;
				$lists = ele.find('ul').parent('li');
				$lists.append('<i class="fa fa-caret-right icon-has-ul"></i>');
				$a = $lists.children('a');
				$listsRest = ele.children('li').not($lists);
				$aRest = $listsRest.children('a');
				app = $('#app');
				$a.on('click', function(event) {
					var $parent, $this;
					if (app.hasClass('nav-min')) {
						return false;
					}
					$this = $(this);
					$parent = $this.parent('li');
					$lists.not($parent).removeClass('open').find('ul').slideUp();
					$parent.toggleClass('open').find('ul').slideToggle();
					return event.preventDefault();
				});
				$aRest.on('click', function(event) {
					return $lists.removeClass('open').find('ul').slideUp();
				});
				return scope.$on('minNav:enabled', function(event) {
					return $lists.removeClass('open').find('ul').slideUp();
				});
			}
		};
	}
])

/**
 * [description]
 * highlightActive
 * @return {[type]}                    [description]
 */
.directive('highlightActive', [

	function() {
		return {
			restrict: "A",
			controller: [
				'$scope', '$element', '$attrs', '$location',
				function($scope, $element, $attrs, $location) {
					var highlightActive, links, path;
					links = $element.find('a');
					path = function() {
						return $location.path();
					};
					highlightActive = function(links, path) {
						path = '#' + path;
						return angular.forEach(links, function(link) {
							var $li, $link, href;
							$link = angular.element(link);
							$li = $link.parent('li');
							href = $link.attr('href');
							if ($li.hasClass('active')) {
								$li.removeClass('active');
							}
							if (path.indexOf(href) === 0) {
								return $li.addClass('active');
							}
						});
					};
					highlightActive(links, $location.path());
					return $scope.$watch(path, function(newVal, oldVal) {
						if (newVal === oldVal) {
							return;
						}
						return highlightActive(links, $location.path());
					});
				}
			]
		};
	}
])

/**
 * [description]
 * @return {[type]}       [description]
 */
.directive('toggleOffCanvas', [

	function() {
		return {
			restrict: 'A',
			link: function(scope, ele, attrs) {
				return ele.on('click', function() {
					return $('#app').toggleClass('on-canvas');
				});
			}
		};
	}
])

/**
 * [description]
 * [required]
 * jQuery slim
 *
 * @return {[type]}                  [description]
 */
.directive('slimScroll', [

	function() {
		return {
			restrict: 'A',
			link: function(scope, ele, attrs) {
				return ele.slimScroll({
					height: attrs.scrollHeight || '100%'
				});
			}
		};
	}
])

/**
 * [description]
 * go back
 * @return {[type]}                           [description]
 */
.directive('goBack', [

	function() {
		return {
			restrict: "A",
			controller: [
				'$scope', '$element', '$window',
				function($scope, $element, $window) {
					return $element.on('click', function() {
						return $window.history.back();
					});
				}
			]
		};
	}
])

/**
 * [description]
 * show current time
 * @return {[type]}                            [description]
 */
.directive("myCurrentTime", [
	"$interval", "dateFilter",
	function($interval, dateFilter) {
		return function(scope, element, attrs) {
			var format, stopTime, updateTime;
			updateTime = function() {
				element.text(dateFilter(new Date(), format));
			};
			format = void 0;
			stopTime = void 0;
			scope.$watch(attrs.myCurrentTime, function(value) {
				format = value;
				updateTime();
			});
			stopTime = $interval(updateTime, 1000);
			element.on("$destroy", function() {
				$interval.cancel(stopTime);
			});
		};
	}
])

.directive('gaugeChart', [
  function() {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        options: '='
      },
      link: function(scope, ele, attrs) {
        var data, gauge, options;
        data = scope.data;
        options = scope.options;
        gauge = new Gauge(ele[0]).setOptions(options);
        gauge.maxValue = data.maxValue;
        gauge.animationSpeed = data.animationSpeed;
        return gauge.set(data.val);
      }
    };
  }
]).directive('flotChart', [
  function() {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        options: '='
      },
      link: function(scope, ele, attrs) {
        var data, options, plot;
        data = scope.data;
        options = scope.options;
        return plot = $.plot(ele[0], data, options);
      }
    };
  }
]).directive('flotChartRealtime', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, ele, attrs) {
        var data, getRandomData, plot, totalPoints, update, updateInterval;
        data = [];
        totalPoints = 300;
        getRandomData = function() {
          var i, prev, res, y;
          if (data.length > 0) {
            data = data.slice(1);
          }
          while (data.length < totalPoints) {
            prev = (data.length > 0 ? data[data.length - 1] : 50);
            y = prev + Math.random() * 10 - 5;
            if (y < 0) {
              y = 0;
            } else {
              if (y > 100) {
                y = 100;
              }
            }
            data.push(y);
          }
          res = [];
          i = 0;
          while (i < data.length) {
            res.push([i, data[i]]);
            ++i;
          }
          return res;
        };
        update = function() {
          plot.setData([getRandomData()]);
          plot.draw();
          setTimeout(update, updateInterval);
        };
        data = [];
        totalPoints = 300;
        updateInterval = 200;
        plot = $.plot(ele[0], [getRandomData()], {
          series: {
            lines: {
              show: true,
              fill: true
            },
            shadowSize: 0
          },
          yaxis: {
            min: 0,
            max: 100
          },
          xaxis: {
            show: false
          },
          grid: {
            hoverable: true,
            borderWidth: 1,
            borderColor: '#eeeeee'
          },
          colors: ["#5BDDDC"]
        });
        return update();
      }
    };
  }
]).directive('sparkline', [
  function() {
    return {
      restrict: 'A',
      scope: {
        data: '=',
        options: '='
      },
      link: function(scope, ele, attrs) {
        var data, options, sparkResize, sparklineDraw;
        data = scope.data;
        options = scope.options;
        sparkResize = void 0;
        sparklineDraw = function() {
          return ele.sparkline(data, options);
        };
        $(window).resize(function(e) {
          clearTimeout(sparkResize);
          return sparkResize = setTimeout(sparklineDraw, 200);
        });
        return sparklineDraw();
      }
    };
  }
]).directive('morrisChart', [
  function() {
    return {
      restrict: 'A',
      scope: {
        data: '='
      },
      link: function(scope, ele, attrs) {
        var colors, data, func, options;
        data = scope.data;
        switch (attrs.type) {
          case 'line':
            if (attrs.lineColors === void 0 || attrs.lineColors === '') {
              colors = null;
            } else {
              colors = JSON.parse(attrs.lineColors);
            }
            options = {
              element: ele[0],
              data: data,
              xkey: attrs.xkey,
              ykeys: JSON.parse(attrs.ykeys),
              labels: JSON.parse(attrs.labels),
              lineWidth: attrs.lineWidth || 2,
              lineColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed']
            };
            return new Morris.Line(options);
          case 'area':
            if (attrs.lineColors === void 0 || attrs.lineColors === '') {
              colors = null;
            } else {
              colors = JSON.parse(attrs.lineColors);
            }
            options = {
              element: ele[0],
              data: data,
              xkey: attrs.xkey,
              ykeys: JSON.parse(attrs.ykeys),
              labels: JSON.parse(attrs.labels),
              lineWidth: attrs.lineWidth || 2,
              lineColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
              behaveLikeLine: attrs.behaveLikeLine || false,
              fillOpacity: attrs.fillOpacity || 'auto',
              pointSize: attrs.pointSize || 4
            };
            return new Morris.Area(options);
          case 'bar':
            if (attrs.barColors === void 0 || attrs.barColors === '') {
              colors = null;
            } else {
              colors = JSON.parse(attrs.barColors);
            }
            options = {
              element: ele[0],
              data: data,
              xkey: attrs.xkey,
              ykeys: JSON.parse(attrs.ykeys),
              labels: JSON.parse(attrs.labels),
              barColors: colors || ['#0b62a4', '#7a92a3', '#4da74d', '#afd8f8', '#edc240', '#cb4b4b', '#9440ed'],
              stacked: attrs.stacked || null
            };
            return new Morris.Bar(options);
          case 'donut':
            if (attrs.colors === void 0 || attrs.colors === '') {
              colors = null;
            } else {
              colors = JSON.parse(attrs.colors);
            }
            options = {
              element: ele[0],
              data: data,
              colors: colors || ['#0B62A4', '#3980B5', '#679DC6', '#95BBD7', '#B0CCE1', '#095791', '#095085', '#083E67', '#052C48', '#042135']
            };
            if (attrs.formatter) {
              func = new Function('y', 'data', attrs.formatter);
              options.formatter = func;
            }
            return new Morris.Donut(options);
        }
      }
    };
  }
])

.directive('uiJqvmap', [
  function() {
    return {
      restrict: 'A',
      scope: {
        options: '='
      },
      link: function(scope, ele, attrs) {
        var options;
        options = scope.options;
        return ele.vectorMap(options);
      }
    };
  }
]).controller('jqvmapCtrl', [
  '$scope', function($scope) {
    var sample_data;
    sample_data = {
      "af": "16.63",
      "al": "11.58",
      "dz": "158.97",
      "ao": "85.81",
      "ag": "1.1",
      "ar": "351.02",
      "am": "8.83",
      "au": "1219.72",
      "at": "366.26",
      "az": "52.17",
      "bs": "7.54",
      "bh": "21.73",
      "bd": "105.4",
      "bb": "3.96",
      "by": "52.89",
      "be": "461.33",
      "bz": "1.43",
      "bj": "6.49",
      "bt": "1.4",
      "bo": "19.18",
      "ba": "16.2",
      "bw": "12.5",
      "br": "2023.53",
      "bn": "11.96",
      "bg": "44.84",
      "bf": "8.67",
      "bi": "1.47",
      "kh": "11.36",
      "cm": "21.88",
      "ca": "1563.66",
      "cv": "1.57",
      "cf": "2.11",
      "td": "7.59",
      "cl": "199.18",
      "cn": "5745.13",
      "co": "283.11",
      "km": "0.56",
      "cd": "12.6",
      "cg": "11.88",
      "cr": "35.02",
      "ci": "22.38",
      "hr": "59.92",
      "cy": "22.75",
      "cz": "195.23",
      "dk": "304.56",
      "dj": "1.14",
      "dm": "0.38",
      "do": "50.87",
      "ec": "61.49",
      "eg": "216.83",
      "sv": "21.8",
      "gq": "14.55",
      "er": "2.25",
      "ee": "19.22",
      "et": "30.94",
      "fj": "3.15",
      "fi": "231.98",
      "fr": "2555.44",
      "ga": "12.56",
      "gm": "1.04",
      "ge": "11.23",
      "de": "3305.9",
      "gh": "18.06",
      "gr": "305.01",
      "gd": "0.65",
      "gt": "40.77",
      "gn": "4.34",
      "gw": "0.83",
      "gy": "2.2",
      "ht": "6.5",
      "hn": "15.34",
      "hk": "226.49",
      "hu": "132.28",
      "is": "12.77",
      "in": "1430.02",
      "id": "695.06",
      "ir": "337.9",
      "iq": "84.14",
      "ie": "204.14",
      "il": "201.25",
      "it": "2036.69",
      "jm": "13.74",
      "jp": "5390.9",
      "jo": "27.13",
      "kz": "129.76",
      "ke": "32.42",
      "ki": "0.15",
      "kr": "986.26",
      "undefined": "5.73",
      "kw": "117.32",
      "kg": "4.44",
      "la": "6.34",
      "lv": "23.39",
      "lb": "39.15",
      "ls": "1.8",
      "lr": "0.98",
      "ly": "77.91",
      "lt": "35.73",
      "lu": "52.43",
      "mk": "9.58",
      "mg": "8.33",
      "mw": "5.04",
      "my": "218.95",
      "mv": "1.43",
      "ml": "9.08",
      "mt": "7.8",
      "mr": "3.49",
      "mu": "9.43",
      "mx": "1004.04",
      "md": "5.36",
      "mn": "5.81",
      "me": "3.88",
      "ma": "91.7",
      "mz": "10.21",
      "mm": "35.65",
      "na": "11.45",
      "np": "15.11",
      "nl": "770.31",
      "nz": "138",
      "ni": "6.38",
      "ne": "5.6",
      "ng": "206.66",
      "no": "413.51",
      "om": "53.78",
      "pk": "174.79",
      "pa": "27.2",
      "pg": "8.81",
      "py": "17.17",
      "pe": "153.55",
      "ph": "189.06",
      "pl": "438.88",
      "pt": "223.7",
      "qa": "126.52",
      "ro": "158.39",
      "ru": "1476.91",
      "rw": "5.69",
      "ws": "0.55",
      "st": "0.19",
      "sa": "434.44",
      "sn": "12.66",
      "rs": "38.92",
      "sc": "0.92",
      "sl": "1.9",
      "sg": "217.38",
      "sk": "86.26",
      "si": "46.44",
      "sb": "0.67",
      "za": "354.41",
      "es": "1374.78",
      "lk": "48.24",
      "kn": "0.56",
      "lc": "1",
      "vc": "0.58",
      "sd": "65.93",
      "sr": "3.3",
      "sz": "3.17",
      "se": "444.59",
      "ch": "522.44",
      "sy": "59.63",
      "tw": "426.98",
      "tj": "5.58",
      "tz": "22.43",
      "th": "312.61",
      "tl": "0.62",
      "tg": "3.07",
      "to": "0.3",
      "tt": "21.2",
      "tn": "43.86",
      "tr": "729.05",
      "tm": 0,
      "ug": "17.12",
      "ua": "136.56",
      "ae": "239.65",
      "gb": "2258.57",
      "us": "14624.18",
      "uy": "40.71",
      "uz": "37.72",
      "vu": "0.72",
      "ve": "285.21",
      "vn": "101.99",
      "ye": "30.02",
      "zm": "15.69",
      "zw": "5.57"
    };
    $scope.worldMap = {
      map: 'world_en',
      backgroundColor: null,
      color: '#ffffff',
      hoverOpacity: 0.7,
      selectedColor: '#666666',
      enableZoom: true,
      showTooltip: true,
      values: sample_data,
      scaleColors: ['#C4FFFF', '#07C0BB'],
      normalizeFunction: 'polynomial'
    };
    $scope.USAMap = {
      map: 'usa_en',
      backgroundColor: null,
      color: '#ffffff',
      hoverColor: '#999999',
      selectedColor: '#666666',
      enableZoom: true,
      showTooltip: true,
      selectedRegion: 'MO'
    };
    return $scope.europeMap = {
      map: 'europe_en',
      backgroundColor: null,
      color: '#ffffff',
      hoverOpacity: 0.7,
      hoverColor: '#999999',
      enableZoom: false,
      showTooltip: false,
      values: sample_data,
      scaleColors: ['#C4FFFF', '#07C0BB'],
      normalizeFunction: 'polynomial'
    };
  }
]);