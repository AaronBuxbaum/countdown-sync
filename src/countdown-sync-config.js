angular.module('countdownSync')

  .value('FIREBASE_REF', new Firebase('https://countdown-sync.firebaseio.com'))

  .config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/create', {
        templateUrl: '/create-countdown.html',
        controller: 'CreateCountdownCtrl',
        controllerAs: '$ctrl'
      })
      .when('/:id', {
        templateUrl: '/countdown.html',
        controller: 'CountdownCtrl',
        controllerAs: '$ctrl'
      })
      .otherwise({
        redirectTo: '/create'
      });
  });