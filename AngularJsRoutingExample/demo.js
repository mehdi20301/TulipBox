/* eslint no-alert: 0 */

'use strict';

//
// Here is how to define your module
// has dependent on mobile-angular-ui
//
var app = angular.module('TulipCloudsApp', [
  'ngRoute',
  'mobile-angular-ui',
  'ui.router',
  // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'.
  // This is intended to provide a flexible, integrated and and
  // easy to use alternative to other 3rd party libs like hammer.js, with the
  // final pourpose to integrate gestures into default ui interactions like
  // opening sidebars, turning switches on/off ..
  'mobile-angular-ui.gestures'
]);

//app.run(function ($transform) {
//    window.$transform = $transform;
//    //$rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
//    //    alert('y');
//    //});
//});
app.run(function ($transform, $rootScope, $state, AuthService) {
    window.$transform = $transform;
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        //debugger;
        //var cookieWObject = read_cookie('cookieName');
        //!AuthService.IsAuthenticated()
        if (toState.authenticate ) {
            alert("Not Authenticated");
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault();
        }

    });
});
//
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false'
// in order to avoid unwanted routing.
//
//app.config(function($routeProvider) {
//    $routeProvider.when('/', { templateUrl: 'partials/home.html', reloadOnSearch: false });
//  $routeProvider.when('/scroll', { templateUrl: 'partials/scroll.html', reloadOnSearch: true });
//  $routeProvider.when('/toggle', { templateUrl: 'partials/toggle.html', reloadOnSearch: false });
//  $routeProvider.when('/tabs', { templateUrl: 'partials/tabs.html', reloadOnSearch: false });
//  $routeProvider.when('/accordion', { templateUrl: 'partials/accordion.html', reloadOnSearch: false });
//  $routeProvider.when('/overlay', { templateUrl: 'partials/overlay.html', reloadOnSearch: false });
//  $routeProvider.when('/forms', { templateUrl: 'partials/forms.html', reloadOnSearch: false });
//  $routeProvider.when('/dropdown', { templateUrl: 'partials/dropdown.html', reloadOnSearch: false });
//  $routeProvider.when('/touch', { templateUrl: 'partials/touch.html', reloadOnSearch: false });
//  $routeProvider.when('/swipe', { templateUrl: 'partials/swipe.html', reloadOnSearch: false });
//  $routeProvider.when('/drag', { templateUrl: 'partials/drag.html', reloadOnSearch: true });
//  $routeProvider.when('/drag2', { templateUrl: 'partials/drag2.html', reloadOnSearch: false });
//  $routeProvider.when('/carousel', { templateUrl: 'partials/carousel.html', reloadOnSearch: false });
//});
app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'partials/partial-home.html',
            authenticate: true
        })
        .state("login", {
            url: "/login",
            templateUrl: "partials/login.html",
            controller: "myLoggingCtrl",
            authenticate: false
        })
        .state("toggle", {
            url: "/toggle",
            templateUrl: "partials/toggle.html",
            authenticate: false
        })
        .state("addAuto", {
            url: "/addAuto",
            templateUrl: "partials/addAuto.html",
            authenticate: false
        })
        .state("scroll", {
            url: "/scroll",
            templateUrl: "partials/scroll.html",
            authenticate: false
        })
        .state("forms", {
            url: "/forms",
            templateUrl: "partials/forms.html",
            authenticate: false
        })
        .state("uploadFile", {
            url: "/uploadFile",
            templateUrl: "partials/uploadFile.html",
            authenticate: false
        })
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit  
            url: '/about',
            templateUrl: 'partials/partial-about.html',
            authenticate: false
        })
    ;
    //If know route matches it will works........
    $urlRouterProvider.otherwise("/login"); 
});
//
// `$touch example`
//

app.directive('toucharea', ['$touch', function($touch) {
    // Runs during compile
  return {
    restrict: 'C',
    link: function($scope, elem) {
      $scope.touch = null;
      $touch.bind(elem, {
        start: function(touch) {
          $scope.containerRect = elem[0].getBoundingClientRect();
          $scope.touch = touch;
          $scope.$apply();
        },

        cancel: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        move: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        },

        end: function(touch) {
          $scope.touch = touch;
          $scope.$apply();
        }
      });
    }
  };
}]);

//
// `$drag` example: drag to dismiss
//
app.directive('dragToDismiss', function($drag, $parse, $timeout) {
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var dismissFn = $parse(attrs.dragToDismiss);
      return function(scope, elem) {
        var dismiss = false;

        $drag.bind(elem, {
          transform: $drag.TRANSLATE_RIGHT,
          move: function(drag) {
            if (drag.distanceX >= drag.rect.width / 4) {
              dismiss = true;
              elem.addClass('dismiss');
            } else {
              dismiss = false;
              elem.removeClass('dismiss');
            }
          },
          cancel: function() {
            elem.removeClass('dismiss');
          },
          end: function(drag) {
            if (dismiss) {
              elem.addClass('dismitted');
              $timeout(function() {
                scope.$apply(function() {
                  dismissFn(scope);
                });
              }, 300);
            } else {
              drag.reset();
            }
          }
        });
      };
    }
  };
});

//
// Another `$drag` usage example: this is how you could create
// a touch enabled "deck of cards" carousel. See `carousel.html` for markup.
//
app.directive('carousel', function() {
  return {
    restrict: 'C',
    scope: {},
    controller: function() {
      this.itemCount = 0;
      this.activeItem = null;

      this.addItem = function() {
        var newId = this.itemCount++;
        this.activeItem = this.itemCount === 1 ? newId : this.activeItem;
        return newId;
      };

      this.next = function() {
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === this.itemCount - 1 ? 0 : this.activeItem + 1;
      };

      this.prev = function() {
        this.activeItem = this.activeItem || 0;
        this.activeItem = this.activeItem === 0 ? this.itemCount - 1 : this.activeItem - 1;
      };
    }
  };
});

app.directive('carouselItem', function($drag) {
  return {
    restrict: 'C',
    require: '^carousel',
    scope: {},
    transclude: true,
    template: '<div class="item"><div ng-transclude></div></div>',
    link: function(scope, elem, attrs, carousel) {
      scope.carousel = carousel;
      var id = carousel.addItem();

      var zIndex = function() {
        var res = 0;
        if (id === carousel.activeItem) {
          res = 2000;
        } else if (carousel.activeItem < id) {
          res = 2000 - (id - carousel.activeItem);
        } else {
          res = 2000 - (carousel.itemCount - 1 - carousel.activeItem + id);
        }
        return res;
      };

      scope.$watch(function() {
        return carousel.activeItem;
      }, function() {
        elem[0].style.zIndex = zIndex();
      });

      $drag.bind(elem, {
        //
        // This is an example of custom transform function
        //
        transform: function(element, transform, touch) {
          //
          // use translate both as basis for the new transform:
          //
          var t = $drag.TRANSLATE_BOTH(element, transform, touch);

          //
          // Add rotation:
          //
          var Dx = touch.distanceX;
          var t0 = touch.startTransform;
          var sign = Dx < 0 ? -1 : 1;
          var angle = sign * Math.min((Math.abs(Dx) / 700) * 30, 30);

          t.rotateZ = angle + (Math.round(t0.rotateZ));

          return t;
        },
        move: function(drag) {
          if (Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            elem.addClass('dismiss');
          } else {
            elem.removeClass('dismiss');
          }
        },
        cancel: function() {
          elem.removeClass('dismiss');
        },
        end: function(drag) {
          elem.removeClass('dismiss');
          if (Math.abs(drag.distanceX) >= drag.rect.width / 4) {
            scope.$apply(function() {
              carousel.next();
            });
          }
          drag.reset();
        }
      });
    }
  };
});

app.directive('dragMe', ['$drag', function($drag) {
  return {
    controller: function($scope, $element) {
      $drag.bind($element,
        {
          //
          // Here you can see how to limit movement
          // to an element
          //
          transform: $drag.TRANSLATE_INSIDE($element.parent()),
          end: function(drag) {
            // go back to initial position
            drag.reset();
          }
        },
        { // release touch when movement is outside bounduaries
          sensitiveArea: $element.parent()
        }
      );
    }
  };
}]);

//
// For this trivial demo we have just a unique MainController
// for everything
//

app.controller("myLoggingCtrl", function ($scope, $http, $state, AuthService,Storage) {
    $scope.myFunc = function (Users) {
        console.log(Users);
        //var promisePost = crudService.post(Users);
        return $http({
            method: 'POST',
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            url: 'http://localhost:60099/api/jwt',
            data: JSON.stringify(Users),
        }).then(function (data) {
            AuthService._isAuthenticated = true;
            AuthService._isAccessToken = data.access_token;
            console.log(AuthService);
            bake_cookie('cookieName', data);
            $state.go("home");
        });
        console.log(promisePost);
    }
});

app.service('AuthService', function () {
    this._isAuthenticated = false;
    this._isAccessToken = '';
    this.IsAuthenticated = function () {
        return this._isAuthenticated;
    }
});
function TodoCtrl($scope) {
    $scope.todos = [
      { text: 'learn angular', done: true },
      { text: 'build an angular app', done: false }];

    $scope.addTodo = function () {
        $scope.todos.push({ text: $scope.todoText, done: false });
        $scope.todoText = '';
    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (todo) {
            if (!todo.done) $scope.todos.push(todo);
        });
    };
}
function readText(filePath) {
    var reader = new FileReader();
    var output = ""; //placeholder for text output
    if (filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            output = e.target.result;
            displayContents(output);
            window.$transform = "/home";
        };//end onload()
        reader.readAsText(filePath.files[0]);
        
    }//end if html5 filelist support
    else if (ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
            displayContents(output);
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' +
                 'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' +
                 'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"');
            }
        }
    }
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }
    return true;
}
function displayContents(txt) {
    var el = document.getElementById('main');
    el.innerHTML = txt; //display output in DOM
}

//app.factory('Storage', function ($q, $http) {

//    var storage = {};
//    storage.get = function (callback) {

//        if (!storage.storedData) {
//            return $http.get('http://run.plnkr.co/nPjEQoK0Qd2PeOX4/data.json').then(function (res) {
//                storage.storedData = res.data;
//                return storage.storedData
//            }).then(callback)
//        } else {
//            var def = $q.defer();
//            def.done(callback);
//            defer.resolve(storage.storedData);
//            return def.promise;
//        }


//    }
//    storage.set = function (obj) {
//        /* do ajax update and on success*/
//        if (!storage.storedData) {
//            storage.storedData = [];
//        }
//        storage.storedData.push(obj);
//    }
//    return storage;
//});
app.controller('MainController', function ($rootScope, $scope) {

    //
    //
    $scope.formtodo = {};
    $scope.todos = [
      { text: 'salam', done: true , count:1 },
      { text: 'bye', done: false,count:1 }];

    $scope.addTodo = function () {
        $scope.todos.push({ text: $scope.formtodo.todoText, done: false });
        $scope.formtodo.todoText = '';
    };

    $scope.remaining = function () {
        var count = 0;
        angular.forEach($scope.todos, function (todo) {
            count += todo.done ? 0 : 1;
        });
        return count;
    };

    $scope.archive = function () {
        var oldTodos = $scope.todos;
        $scope.todos = [];
        angular.forEach(oldTodos, function (todo) {
            if (!todo.done) $scope.todos.push(todo);
        });
    };
    //
    //

  $scope.swiped = function(direction) {
    alert('Swiped ' + direction);
  };
  // User agent displayed in home page
  $scope.userAgent = navigator.userAgent;

  // Needed for the loading screen
  $rootScope.$on('$routeChangeStart', function() {
    $rootScope.loading = true;
  });

  $rootScope.$on('$routeChangeSuccess', function() {
    $rootScope.loading = false;
  });

  // Fake text i used here and there.
  $scope.lorem = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. ' +
    'Vel explicabo, aliquid eaque soluta nihil eligendi adipisci error, illum ' +
    'corrupti nam fuga omnis quod quaerat mollitia expedita impedit dolores ipsam. Obcaecati.';

  //
  // 'Scroll' screen
    //


  var scrollItems = [];

  //for (var i = 1; i <= 100; i++) {
  //  scrollItems.push('Item ' + i);
  //}

    //$scope.scrollItems = scrollItems;
  //Storage.get(function (data) {
  //    $scope.items = data
  //});

  $scope.uploadFile = function () {
      var reader = new FileReader();
      var filePath = document.getElementById('fileUploader');
      var output = ""; //placeholder for text output
      if (filePath.files && filePath.files[0]) {
          reader.onload = function (e) {
              output = e.target.result;
              
              $scope.LoadScrollItems(output);
              //displayContents(output);
          };//end onload()
          reader.readAsText(filePath.files[0]);
          
      }//end if html5 filelist support
  };
  $scope.bottomReached = function() {
      alert('Congrats you scrolled to the end of the list!');
  };
  $scope.orderByClick = function (x) {
      if ($scope.customOrderBy == x) {
          $scope.customOrderBy = -x;
      }else
      {
          $scope.customOrderBy = x;
      }
      
  }
  $scope.LoadScrollItems = function (result) {

      var items = result.split(' ');

      //var newtodo = [];
      //for (var i = 1; i <= items.length; i++) {
      //    newtodo.push({ text: items[i], done: false });
      //}
      angular.forEach(items, function (item) {

          //var findingItem = $scope.todos.filter(function (filteritem) {
          //    return filteritem.text === item;
          //});
          var find =false;
          angular.forEach($scope.todos, function (todo) {
              if(!find)
                  if (todo.text == item)
                  {
                      todo.count += 1;
                      find = true;
                  }
          });

          if (!find) {
              $scope.todos.push({ text: item, done: false , count:1 });
          }
      });
      $scope.$apply();
  }
 
  //
  // Right Sidebar
  //
  $scope.chatUsers = [
    {name: 'Carlos  Flowers', online: true},
    {name: 'Byron Taylor', online: true},
    {name: 'Jana  Terry', online: true},
    {name: 'Darryl  Stone', online: true},
    {name: 'Fannie  Carlson', online: true},
    {name: 'Holly Nguyen', online: true},
    {name: 'Bill  Chavez', online: true},
    {name: 'Veronica  Maxwell', online: true},
    {name: 'Jessica Webster', online: true},
    {name: 'Jackie  Barton', online: true},
    {name: 'Crystal Drake', online: false},
    {name: 'Milton  Dean', online: false},
    {name: 'Joann Johnston', online: false},
    {name: 'Cora  Vaughn', online: false},
    {name: 'Nina  Briggs', online: false},
    {name: 'Casey Turner', online: false},
    {name: 'Jimmie  Wilson', online: false},
    {name: 'Nathaniel Steele', online: false},
    {name: 'Aubrey  Cole', online: false},
    {name: 'Donnie  Summers', online: false},
    {name: 'Kate  Myers', online: false},
    {name: 'Priscilla Hawkins', online: false},
    {name: 'Joe Barker', online: false},
    {name: 'Lee Norman', online: false},
    {name: 'Ebony Rice', online: false}
  ];

  //
  // 'Forms' screen
  //
  $scope.rememberMe = true;
  $scope.email = 'me@example.com';

  $scope.login = function () {
      
      alert('You submitted the login form' + $scope.email + $scope.customText + $scope.rememberMe);
  };

    //
    //
    //
    

  //
  // 'Drag' screen
  //
  $scope.notices = [];

  for (var j = 0; j < 10; j++) {
    $scope.notices.push({icon: 'envelope', message: 'Notice ' + (j + 1)});
  }

  $scope.deleteNotice = function(notice) {
    var index = $scope.notices.indexOf(notice);
    if (index > -1) {
      $scope.notices.splice(index, 1);
    }
  };
});
