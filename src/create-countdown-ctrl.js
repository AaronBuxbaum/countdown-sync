angular
    .module('countdownSync')
    .controller('CreateCountdownCtrl', function (CreateCountdownService) {
        var ctrl = this;

        // Create a countdown link
        ctrl.createCountdownLink = function () {
            return CreateCountdownService.createLink().then(openCountdownLink_);
        };

        // Redirect the browser to a specified countdown link object
        var openCountdownLink_ = function (linkRef) {
            linkRef.once('value', function (linkObj) {
                return CreateCountdownService.openLink(linkObj.key);
            });
        };
    });