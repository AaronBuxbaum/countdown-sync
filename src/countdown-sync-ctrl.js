angular.module('countdownSync')

  .controller('CreateCountdownCtrl', function(CountdownService) {
    this.createCountdownLink = function() {
      return CountdownService.createLink().then(function(obj) {
        return CountdownService.openLink(obj.$id);
      });
    };
  })

  .controller('CountdownCtrl', function($location, $firebaseObject, $scope, FIREBASE_REF) {
    var ctrl = this;
    var uniqueId = $location.path();
    var intervalId;
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
            ctrl.stopCountdown();
          }
        }, 1000);
      };

      ctrl.stopCountdown = function() {
        $scope.$ctrl.countdown.timer = null;
        clearInterval(intervalId);
      };
    });
  });