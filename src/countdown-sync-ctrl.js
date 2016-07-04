angular.module('countdownSync')

  .controller('CreateCountdownCtrl', function (CountdownService) {
    this.createCountdownLink = function () {
      return CountdownService.createLink().then(function (obj) {
        return CountdownService.openLink(obj.$id);
      });
    };
  })

  .controller('CountdownCtrl', function ($state, $interval) {
    var ctrl = this;
    var intervalId;
    var uniqueId = $state.params.id;
    var ref = firebase.database().ref().child('links').child(uniqueId);

    // Get the number of active users
    var usersRef = ref.child('users');
    usersRef.once('value', function (response) {
      var connection = usersRef.push(true);
      connection.onDisconnect().remove();
    });

    var startCountdown = function (value) {
      intervalId = $interval(function () {
        var d = value - Date.now();
        ctrl.countdown = (d > 0) ? ((value - Date.now()) / 1000).toFixed(1) + ' seconds' : 'GO!';
      }, 100);
    };

    var startTimeRef = ref.child('startTime');
    startTimeRef.on('value', function (response) {
      if (response.val()) {
        startCountdown(response.val());
      }
      else {
        $interval.cancel(intervalId);
        ctrl.countdown = null;
      }
    });

    ctrl.clickedReady = false;
    ctrl.ready = function () {
      if (!ctrl.clickedReady) {
        var readyCount = ref.child('ready');
        var isReady = readyCount.push(true);
        isReady.onDisconnect().remove();
        ctrl.clickedReady = true;
      }
    };

    ref.child('ready').on('value', function (ready) {
      usersRef.on('value', function (users) {
        ctrl.showStartCountdown = ready.numChildren() >= users.numChildren();
      });
    });

    ctrl.startCountdown = function () {
      if (ctrl.showStartCountdown) {
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