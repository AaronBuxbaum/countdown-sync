angular
  .module('countdownSync')
  .service('CountdownService', function ($http, $q, $state) {
    var WORDNIK;
    firebase.database().ref('env/WORDNIK').once('value', function (snapshot) {
      WORDNIK = snapshot.val();
    });

    // Get a random word, given a part of speech.
    // Should be a relatively common word, with minimum corpus of 10000
    var getRandomWord_ = function (partOfSpeech) {
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

    // Get a random adjective and a random noun
    var generateRandomKey_ = function () {
      return $q.all([
        getRandomWord_('adjective'),
        getRandomWord_('noun')
      ]);
    };

    // Map id to standardized format
    var generateUniqueId_ = function (words) {
      return words.map(function (word) {
        return word.data.word.toLowerCase();
      }).join('-');
    };

    // Create id in the database
    this.createLink = function () {
      return generateRandomKey_().then(function (response) {
        if (!response.length === 2 || !response[0].data.word.length || !response[1].data.word.length) {
          return;
        }

        var uniqueId = generateUniqueId_(response);
        var newLink = firebase.database().ref('links').child(uniqueId);
        newLink.child('createdTime').set(Date.now());
        return newLink;
      });
    };

    // Change state to go to the given key
    this.openLink = function (key) {
      return $state.go('links', { id: key });
    };
  });