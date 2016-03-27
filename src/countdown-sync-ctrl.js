angular.module('countdownSync')

  .controller('CreateCountdownCtrl', function(CountdownService) {
    this.createCountdownLink = function() {
      return CountdownService.createLink().then(function(obj) {
        return CountdownService.openLink(obj.$id);
      });
    };
  })

  .controller('CountdownCtrl', function($state, $firebaseObject, $scope, FIREBASE_REF) {
    var ctrl = this;
    var intervalId;

    var uniqueId = $state.params.id;
    var object = $firebaseObject(FIREBASE_REF.child(uniqueId));

    object.$bindTo($scope, '$ctrl.countdown').then(function() {
      ctrl.startCountdown = function() {
        $scope.$ctrl.countdown.timer = 10;
        intervalId = setInterval(function() {
          $scope.$apply(function() {
            if (_.isNumber($scope.$ctrl.countdown.timer)) {
              $scope.$ctrl.countdown.timer--;
            }
          });

          if ($scope.$ctrl.countdown.timer < 1) {
            clearInterval(intervalId);
          }
        }, 1000);
      };

      ctrl.stopCountdown = function() {
        $scope.$ctrl.countdown.timer = null;
        clearInterval(intervalId);
      };
    });

    ctrl.getURL = function() {
      return window.location.href;
    };
  });