angular
  .module('countdownSync')
  .service('CountdownSyncService', function ($window) {
    // Get the page's full URL
    this.getURL = function () {
      return $window.location.href;
    };

    // Pluralization rules for fancy text
    this.readyRules = {
      '0': 'Everybody is ready! LEGGO!',
      'one': '1 person is not ready yet.',
      'other': '{} people are not ready yet.'
    };

    // Print the number of seconds (with one decimal point) remaining
    // @param {Date} time the start time for the timer
    // @return {string} pretty printed countdown text
    this.prettyPrintCountdown = function (dTime) {
      dTime = dTime / 1000;
      dTime = dTime.toFixed(1);
      return dTime + ' seconds';
    };
  });