'use strict';

var app = angular.module("designProject", ["ngRoute","ui.bootstrap"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "views/carrier-overview.html",
    controller : "CarrierOverviewCtrl"
  })
  .when("/carrier/add-agency", {
    templateUrl : "views/add-agency.html",
    controller : "CarrierOverviewCtrl"
  })
  .when("/agency", {
    templateUrl : "views/agency-overview.html",
    controller : "AgencyOverviewCtrl"
  })
  .when("/agency/add-license", {
    templateUrl : "views/agency-overview.html",
    controller : "AgencyOverviewCtrl"
  })
  .when("/agency/add-agent", {
    templateUrl : "views/agency-overview.html",
    controller : "AgencyOverviewCtrl"
  })
  $locationProvider.html5Mode(true);
});

app.controller("CarrierOverviewCtrl", function($scope, $http) {
  $http.get("json/carrier-agencies.json")
  .then(function(response) {
    $scope.carrierAgencies = response.data;
  }, function myError(response) {
    console.log(response.statusText + " " + response.status);
  });

  $scope.search = function (key) {
    return (angular.lowercase(key.agencyName).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
    angular.lowercase(key.contact).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
    angular.lowercase(key.headquarters.city).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
    angular.lowercase(key.headquarters.state).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
    angular.lowercase(key.headquarters.stateAbbr).indexOf(angular.lowercase($scope.query) || '') !== -1);
  };

  $scope.propertyName = 'established';
  $scope.reverse = true;

  $scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
});

app.controller("AgencyOverviewCtrl", function($scope, $http, $window, $sce) {
  $http.get("json/us-states.json")
  .then(function(response) {
    $scope.usStates = response.data;
  }, function myError(response) {
    console.log(response.statusText + " " + response.status);
  });

  $http.get("json/policy-types.json")
  .then(function(response) {
    $scope.policyTypes = response.data;
  }, function myError(response) {
    console.log(response.statusText + " " + response.policyTypes);
  });

  $http.get("json/agency-licenses.json")
  .then(function(response) {
    $scope.agencyLicenses = response.data;
  }, function myError(response) {
    console.log(response.statusText + " " + response.agencyLicenses);
  });

  var url = "https://uinames.com/api/?ext&amount=250&region=united%20states&callback=JSON_CALLBACK";
  $http.jsonp(url)
  .success(function(data) {
    $scope.agencyAgents = data;
  });

  $scope.search = function (key) {
    return (angular.lowercase(key.name).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
    angular.lowercase(key.surname).indexOf(angular.lowercase($scope.query) || '') !== -1);
  };

  $scope.showStates = false;
  $scope.showPolicies = true;

  $scope.tabs = [
  {
      title: 'Agents',
      content: 'views/agency-agents.html'
    },
    {
      title: 'Licenses',
      content: 'views/agency-licenses.html'
    }
  ];

  $scope.model = {
    name: 'Tabs'
  };
});

app.directive('phoneInput', function($filter, $browser) {
  return {
    require: 'ngModel',
    link: function($scope, $element, $attrs, ngModelCtrl) {
      var listener = function() {
        var value = $element.val().replace(/[^0-9]/g, '');
        $element.val($filter('tel')(value, false));
      };

      ngModelCtrl.$parsers.push(function(viewValue) {
        return viewValue.replace(/[^0-9]/g, '').slice(0,10);
      });

      ngModelCtrl.$render = function() {
        $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
      };

      $element.bind('change', listener);
      $element.bind('keydown', function(event) {
        var key = event.keyCode;
        if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
          return;
        }
        $browser.defer(listener);
      });

      $element.bind('paste cut', function() {
        $browser.defer(listener);
      });
    }
  };
});

app.filter('tel', function () {
  return function (tel) {
  // console.log(tel);
  if (!tel) { return ''; }

  var value = tel.toString().trim().replace(/^\+/, '');

  if (value.match(/[^0-9]/)) {
    return tel;
  }

  var country, city, number;

  switch (value.length) {
    case 1:
    case 2:
    case 3:
      city = value;
      break;

    default:
      city = value.slice(0, 3);
      number = value.slice(3);
  }

  if(number){
    if(number.length>3){
      number = number.slice(0, 3) + '-' + number.slice(3,7);
    }

    else{
      number = number;
    }

    return ("(" + city + ") " + number).trim();
  }

  else{
    return "(" + city;
  }
  };
});