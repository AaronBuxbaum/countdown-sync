angular.module('countdownSync')

  .service('CountdownService', function($http, $q, $firebaseObject, $location, FIREBASE_REF) {
    var getRandomWord = function(partOfSpeech) {
      return $http.get('//api.wordnik.com:80/v4/words.json/randomWord', {
        params: {
          includePartOfSpeech: partOfSpeech,
          minCorpusCount: 9999,
          minLength: 3,
          maxLength: 8,
          api_key: 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
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
        var newLink = $firebaseObject(FIREBASE_REF.child(uniqueId));
        newLink.createdTime = Date.now();
        newLink.$save();
        return newLink;
      });
    };

    this.openLink = function(key) {
      return $location.path(key);
    };
  });