angular.module('countdownSync')

  .controller('CreateCountdownCtrl', function (CountdownService) {
    this.createCountdownLink = function () {
      return CountdownService.createLink().then(function (obj) {
        return CountdownService.openLink(obj.$id);
      });
    };
  })

  .controller('CountdownCtrl', function ($timeout, $state, $interval) {
    var ctrl = this;
    var intervalId;
    var uniqueId = $state.params.id;
    var ref = firebase.database().ref().child('links').child(uniqueId);
    var usersRef = ref.child('users');
    var startTimeRef = ref.child('startTime');
    var readyRef = ref.child('ready');
    var numberOfReadyUsers;
    var numberOfTotalUsers;

    ctrl.readyRules = {
      '0': 'Everybody is ready! LEGGO!',
      'one': '1 person is not ready yet.',
      'other': '{} people are not ready yet.'
    };

    usersRef.once('value', function (response) {
      var connection = usersRef.push(true);
      connection.onDisconnect().remove();
    });

    var onStartTimeUpdated = function (response) {
      if (response.val()) {
        startCountdown(response.val());
      }
      else {
        $interval.cancel(intervalId);
        ctrl.countdown = null;
      }
    };
    startTimeRef.on('value', onStartTimeUpdated);

    var startCountdown = function (value) {
      intervalId = $interval(function () {
        var d = value - Date.now();
        if (d > 0) {
          ctrl.countdown = ((value - Date.now()) / 1000).toFixed(1) + ' seconds';
        }
        else {
          ctrl.countdown = 'GO!';
          $interval.cancel(intervalId);
        }
      }, 100);
    };

    ctrl.ready = function () {
      if (!ctrl.clickedReady) {
        var readyCount = ref.child('ready');
        var isReady = readyCount.push(true);
        isReady.onDisconnect().remove();
        ctrl.clickedReady = true;
      }
    };

    var updateCountdownButtonVisibility = function () {
      $timeout(function () {
        ctrl.numberOfUnready = numberOfTotalUsers - numberOfReadyUsers;
      });
    };

    usersRef.on('value', function (users) {
      numberOfTotalUsers = users.numChildren();
      updateCountdownButtonVisibility();
    });

    readyRef.on('value', function (ready) {
      numberOfReadyUsers = ready.numChildren();
      updateCountdownButtonVisibility();
    });

    ctrl.startCountdown = function () {
      if (ctrl.numberOfUnready <= 0) {
        startTimeRef.set(Date.now() + 10 * 1000);
      }
    };

    ctrl.stopCountdown = function () {
      startTimeRef.remove();
    };

    ctrl.getURL = function () {
      return window.location.href;
    };
  });