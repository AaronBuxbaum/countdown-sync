angular.module('countdownSync')

  .config(function ($urlRouterProvider, $stateProvider) {
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

    var config = {
      apiKey: "TODO",
      authDomain: "countdown-sync.firebaseapp.com",
      databaseURL: "https://countdown-sync.firebaseio.com",
      storageBucket: "countdown-sync.appspot.com"
    };
    firebase.initializeApp(config);
  });