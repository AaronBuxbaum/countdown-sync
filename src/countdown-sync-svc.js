angular
  .module('countdownSync')
  .service('CountdownSyncService', function () {
    // Pluralization rules for fancy text
    this.readyRules = {
      '0': 'Everybody is ready! LEGGO!',
      'one': '1 person is not ready yet.',
      'other': '{} people are not ready yet.'
    };
  });