angular.module('countdownSync')

  .service('CountdownService', function($http, $q, $firebaseObject, $state, FIREBASE_REF) {
    var WORDNIK;
    FIREBASE_REF.child('env').child('WORDNIK').on('value', function(snapshot) {
      WORDNIK = snapshot.val();
    });

    var getRandomWord = function(partOfSpeech) {
      return $http.jsonp('//api.wordnik.com/v4/words.json/randomWord', {
        params: {
          includePartOfSpeech: partOfSpeech,
          minCorpusCount: 10000,
          maxLength: 10,
          api_key: WORDNIK,
          callback: 'JSON_CALLBACK'
        }
      });
    };

    var generateRandomKey = function() {
      return $q.all([
        getRandomWord('adjective'),
        getRandomWord('noun')
      ]);
    };

    var generateUniqueId = function(words) {
      return words.map(function(word) {
        return word.data.word.toLowerCase();
      }).join('-');
    };

    this.createLink = function() {
      return generateRandomKey().then(function(response) {
        var uniqueId = generateUniqueId(response);
        var newLink = $firebaseObject(FIREBASE_REF.child('links').child(uniqueId));
        newLink.createdTime = Date.now();
        newLink.$save();
        return newLink;
      });
    };

    this.openLink = function(key) {
      return $state.go('links', { id: key });
    };
  });