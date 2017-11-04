// app.js
var routerApp = angular.module('TulipCloudsApp', ['ui.router']);
routerApp.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        //debugger;
        //var cookieWObject = read_cookie('cookieName');
        //!AuthService.IsAuthenticated()
        if (toState.authenticate && !AuthService.IsAuthenticated()) {
            alert("Not Authenticated");
            // User isn’t authenticated
            $state.transitionTo("login");
            event.preventDefault(); 
        }

        
    });
});
routerApp.config(function ($stateProvider, $urlRouterProvider) {
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
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit  
            url: '/about',
            templateUrl: 'partials/partial-about.html',
            authenticate: false
        });
    //If know route matches it will works........
    $urlRouterProvider.otherwise("/login");
});

routerApp.controller("myLoggingCtrl", function ($scope, $http, $state, AuthService) {
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

routerApp.service('AuthService', function () {
    this._isAuthenticated = false;
    this._isAccessToken = '';
    this.IsAuthenticated = function () {
        return this._isAuthenticated;
    }
});

function bake_cookie(name, value) {
    var cookie = [name, '=', JSON.stringify(value.data), '; domain=.', window.location.host.toString(), '; path=/;'];
    document.cookie = cookie;
}

function read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function delete_cookie(name) {
    document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}