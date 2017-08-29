'use strict';

var app = angular.module("designProject", ["ngRoute","ui.bootstrap","angular.filter","matchMedia"]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "views/carrier-overview.html",
    controller : "CarrierOverviewCtrl"
  })
  .when("/agency", {
    templateUrl : "views/agency-overview.html",
    controller : "AgencyOverviewCtrl"
  })
  .when("/agency/agent/add-license", {
    templateUrl : "views/agency-overview.html",
    controller : "AgencyOverviewCtrl"
  })
  $locationProvider.html5Mode(true);
});

app.controller("CarrierOverviewCtrl", function($scope, $http) {
  $http.get("json/carrier-agencies.json")
  .then(function(response) {
    $scope.carrierAgencies = response.data;
  }, function (response) {
    console.log("Error with Carrier Agencies data.");
  });

  $scope.propertyName = 'established';
  $scope.reverse = true;

  $scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
});

app.directive('agencyCells', function() {
  return {
    templateUrl: 'views/agency-cells.html'
  };
});

app.controller("AgencyOverviewCtrl", function($scope, $http, $window, $sce, $location, screenSize) {
  $http.get("json/us-states.json")
  .then(function(response) {
    $scope.usStates = response.data;
  }, function (response) {
    console.log("Error with US States data.");
  });

  $http.get("json/policy-types.json")
  .then(function(response) {
    $scope.policyTypes = response.data;
  }, function (response) {
    console.log("Error with Policy Types data.");
  });

  $http.get("json/agency-licenses.json")
  .then(function(response) {
    $scope.agencyLicenses = response.data;
  }, function (response) {
    console.log("Error with Agency Licenses data.");
  });

  var url = "https://uinames.com/api/?ext&amount=20&region=united%20states&callback=JSON_CALLBACK";
  $http.jsonp(url)
  .then(function(response) {
    $scope.agencyAgents = response.data;
  }, function (response) {
    console.log("Error with UI Names data.");
  });

  $scope.showStates = false;
  $scope.showPolicies = false;

  $scope.toggleStates = function(){
    if(!$scope.showStates) {
      $scope.showStates = true;
    } else {
      $scope.showStates = false;
    }
    $scope.showPolicies = false;
  };

  $scope.togglePolicies = function(){
    if(!$scope.showPolicies) {
      $scope.showPolicies = true;
    } else {
      $scope.showPolicies = false;
    }
    $scope.showStates = false;
  };

  $scope.isMobile = screenSize.on('xs, sm', function(isMatch){
    $scope.isMobile = isMatch;
  });

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

  $scope.examCheck = true;

  $scope.addingLicense = false;
  $scope.addAgentLicense = function(){
    $scope.addingLicense = true;
  };

  $scope.cancelAddAgentLicense = function(){
    $scope.addingLicense = false;
  };

  // datepicker
  // note: ui datepicker is broken w. bootstrap v4
  $scope.dateFormat = 'MM/dd/yyyy';
  $scope.issueDate = new Date();
  $scope.year = $scope.issueDate.getFullYear();
  $scope.month = $scope.issueDate.getMonth();
  $scope.day = $scope.issueDate.getDate();
  $scope.expirationDate = new Date($scope.year + 1, $scope.month, $scope.day);
  //end DP
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

console.log("Adam Butcher's Design Project for BriteCore.");