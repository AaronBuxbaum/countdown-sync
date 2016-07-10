angular
  .module('countdownSync')
  .controller('CountdownSyncCtrl', function ($timeout, $state, $interval, CountdownSyncService) {
    var ctrl = this;
    var intervalId;
    var uniqueId = $state.params.id;
    var ref = firebase.database().ref().child('links').child(uniqueId);
    var usersRef = ref.child('users');
    var startTimeRef = ref.child('startTime');
    var readyRef = ref.child('ready');
    var numberOfReadyUsers;
    var numberOfTotalUsers;

    ctrl.readyRules = CountdownSyncService.readyRules;

    usersRef.once('value', function (response) {
      var connection = usersRef.push(true);
      connection.onDisconnect().remove();
    });

    var onStartTimeUpdated_ = function (response) {
      $timeout(function () {
        if (response.val()) {
          startCountdown_(response.val());
        }
        else {
          $interval.cancel(intervalId);
          ctrl.countdown = null;
        }
      });
    };
    startTimeRef.on('value', onStartTimeUpdated_);

    var startCountdown_ = function (value) {
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
        ctrl.clickedReady = readyRef.push(true);
        ctrl.clickedReady.onDisconnect().remove();
      }
    };

    ctrl.unready = function () {
      if (ctrl.clickedReady) {
        ctrl.clickedReady.remove();
        ctrl.clickedReady = null;
      }
    };

    var updateCountdownButtonVisibility_ = function () {
      $timeout(function () {
        ctrl.numberOfUnready = numberOfTotalUsers - numberOfReadyUsers;
      });
    };

    usersRef.on('value', function (users) {
      numberOfTotalUsers = users.numChildren();
      updateCountdownButtonVisibility_();
    });

    readyRef.on('value', function (ready) {
      numberOfReadyUsers = ready.numChildren();
      updateCountdownButtonVisibility_();
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