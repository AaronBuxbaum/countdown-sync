angular.module('countdownSync')

  .value('FIREBASE_REF', new Firebase('https://countdown-sync.firebaseio.com'))

  .config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('');

    $stateProvider
      .state('create', {
        url: '',
        templateUrl: 'create-countdown.html',
        controller: 'CreateCountdownCtrl',
        controllerAs: '$ctrl'
      })
      .state('links', {
        url: '/:id',
        templateUrl: 'countdown.html',
        controller: 'CountdownCtrl',
        controllerAs: '$ctrl'
      });
  });