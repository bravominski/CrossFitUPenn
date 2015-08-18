
var myAppModule = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

// partial routing!
myAppModule.config(function ($routeProvider) {
  $routeProvider
    .when('/',{ // login page - default
      templateUrl: 'partials/login.html'
    })
    .when('/wod/:wod_id', { // leaderboard page
      templateUrl: 'partials/wod.html'
    })
    .when('/user/:user_id', { // leaderboard page
      templateUrl: 'partials/user.html'
    })
    .when('/leaderboard', { // leaderboard page
      templateUrl: 'partials/leaderboard.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});
// Factory for records
myAppModule.factory('recordFactory', function ($http) {
  var factory = {};

  factory.getRecordsByUser = function(info, callback) {
    $http.post('/records/user', info).success(function (output) {
      callback(output);
    })
  }

  factory.getRecordsByWod = function(info, callback) {
    $http.post('/records/wod', info).success(function (output) {
      callback(output);
    })
  } 

  factory.addRecord = function(info, callback) {
    $http.post('/records/new', info).success(function (output) {
      callback(output);
    })
  }
  return factory;
})

// Factory for users
myAppModule.factory('userFactory', function ($http) {
  var factory = {};
  var users = [];
  // var current_user;

  // getting all users
  factory.getUsers = function (callback) {
    $http.get('/users').success(function (output) {
      users = output;
      callback(users);
    })
  }

  // adding an user
  factory.addUser = function(info, callback) {
    $http.post('/users/new', info).success(function (output) {
      users = output;
      callback(users);
    });
  }

  // removing an user
  factory.removeUser = function(user_id) {
    $http.post('/users/destroy', {id: user_id}).success();
  }

  // retrieve current user
  // factory.getCurrentUser = function() {
  //   if(current_user == undefined) {
  //     current_user = '';
  //   }
  //   return current_user;
  // }

  // set current user
  // factory.login = function(user, callback) {
  //   current_user = user;
  //   callback(current_user);
  // }

  factory.getUser = function(user_id, callback) {
    $http.post('/user', {id: user_id}).success(function (output) {
      callback(output);
    })
  }

  factory.addPoint = function(first_name, score) {
    for(var i = 0; i < users.length; i++) {
      if(users[i].first_name == first_name) {
        var id = users[i].id;
        var original_score = users[i].score;
      }
    }
    $http.post('/user/add_score', {id: id, score: original_score + score}).success(function (output) {
      users = output;
    });
  }

  return factory;
})

// users Controller
myAppModule.controller('usersController', function ($scope, $location, $routeParams, userFactory, recordFactory) {

  $scope.users = [];
  $scope.loginErrorMessages= [];
  $scope.registerErrorMessages= [];
  $scope.registerSuccess='';
  if(!sessionStorage.current_user) {
    $location.path('/')
  }

  // everytime the page is loaded, retrieve the list of all the users
  userFactory.getUsers(function (data) {
    $scope.users = data;
  });

  if($routeParams.user_id) {
    userFactory.getUser($routeParams.user_id, function (output) {
      $scope.user = output;
      recordFactory.getRecordsByUser($scope.user, function (data) {
        $scope.records = data;
      })
    });
  }

  // Login
  $scope.login = function() {
    if($scope.login == undefined || $scope.login.email == '' || $scope.login.password == '') {
      $scope.loginErrorMessages.push("All fields are required!")
      $scope.login = {};
      return;
    }
    for(var i = 0; i < $scope.users.length; i++) {
      if($scope.users[i].email == $scope.login.email) {
        if($scope.users[i].password == $scope.login.password) {
          // userFactory.login($scope.users[i], function(output) {
          //   $scope.current_user = output;
          //   $scope.user = {};
          //   $location.path('/leaderboard');
          // });
          sessionStorage.setItem('current_user', JSON.stringify($scope.users[i]));
          $scope.login = {};
          $location.path('/leaderboard');
        }
        else {
          $scope.loginErrorMessages.push("Wrong password!")
          $scope.login = {};
        }
      }
    }
    $scope.loginErrorMessages.push("Non-registered User!")
    $scope.login = {};
  }

  // Register
  $scope.register = function() {
    if($scope.newUser == undefined || $scope.newUser.email == '' || $scope.newUser.first_name == '' || $scope.newUser.last_name == '' || $scope.newUser.mobile == '' || $scope.newUser.password == '') {
      $scope.registerErrorMessages.push("All fields are required!");
      return;
    }
    for(var i = 0; i < $scope.users.length; i++) {
      if($scope.users[i].email == $scope.newUser.email) {
        $scope.registerErrorMessages.push("Already registered user!");
        return;
      }
    }
    userFactory.addUser($scope.newUser, function(output) {
      $scope.users = output;
      $scope.registerSuccess = "Successfully registered. Please login!"
    })
    $scope.newUser = {};
  }

  $scope.logout = function() {
    sessionStorage.current_user = undefined;
    $location.path('/');
  }
})

// factory for wods
myAppModule.factory('wodFactory', function ($http) {
  var wods = [];
  var factory = {};

  factory.getWods = function(callback) {
    $http.get('/wods').success(function (output) {
      wods = output;
      callback(wods);
    })
  }

  factory.addWod = function(info, callback) {
    $http.post('/wods/new', info).success(function (output) {
      wods = output;
      callback(wods);
    });
  }

  factory.getWod = function(wod_id, callback) {
    $http.post('/wod', {id: wod_id}).success(function (output) {
      callback(output);
    })
  }

  factory.completeWod = function(wod_id, callback) {
    $http.post('/wod/complete', {id: wod_id}).success(function (output) {
      callback(output);
    })
  }
  return factory;
})


// wods controller
myAppModule.controller('wodsController', function ($scope, $location, $modal, $routeParams, userFactory, wodFactory, recordFactory) {
  $scope.wods = [];
  // $scope.current_user = userFactory.getCurrentUser();
  wodFactory.getWods(function (output) {
    $scope.wods = output;
  })

  if($routeParams.wod_id) {
    wodFactory.getWod($routeParams.wod_id, function (output) {
      $scope.wod = output;
      recordFactory.getRecordsByWod($scope.wod, function (data) {
        $scope.records = data;
      })
    });
    
  }

  $scope.addWod = function () {
    // $scope.newWod.coach = $scope.current_user.first_name;
    $scope.newWod.coach = JSON.parse(sessionStorage.current_user).first_name;
    wodFactory.addWod($scope.newWod, function (output) {
      $scope.wods = output;
    })
    $scope.newWod = {};
  }

  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
  }

  $scope.addRecord = function() {
    // $scope.newRecord.user_id = $scope.current_user.id;
    $scope.newRecord.user_id = JSON.parse(sessionStorage.current_user).id;
    $scope.newRecord.wod_id = $routeParams.wod_id;
    $scope.newRecord.type = $scope.wod.type;
    $scope.newRecord.participants = $scope.wod.participants;
    recordFactory.addRecord($scope.newRecord, function (output) {
      $scope.records = output;
    });
    $scope.newRecord = {};
  }

  $scope.submitRecords = function() {
    var score = 10;
    for(var i = 0; i < $scope.records.length; i++) {
      userFactory.addPoint($scope.records[i].first_name, score);
      if(i < $scope.records.length - 1) {
        if($scope.wod.type == 'amrap') {
          if($scope.records[i].reps != $scope.records[i+1].reps) {
            score--;
          }
        }
        else {
          if($scope.records[i].time != $scope.records[i+1].time) {
            score--;
          }
        }
      }
    }
    wodFactory.completeWod($scope.wod.id, function(output) {
      $scope.wod = output;
    })
  }

  $scope.logout = function() {
    sessionStorage.current_user = undefined;
    $location.path('/');
  }

  $scope.isMinsu = function() {
    return JSON.parse(sessionStorage.current_user).first_name == "Minsu";
  }
})

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

myAppModule.controller('ModalInstanceCtrl', function ($scope, $modalInstance) {

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});















