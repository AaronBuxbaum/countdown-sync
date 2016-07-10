angular
    .module('countdownSync')
    .controller('CreateCountdownCtrl', function (CountdownService) {
        var ctrl = this;

        // Create a countdown link
        ctrl.createCountdownLink = function () {
            return CountdownService.createLink().then(openCountdownLink_);
        };

        // Redirect the browser to a specified countdown link object
        var openCountdownLink_ = function (linkRef) {
            linkRef.once('value', function (linkObj) {
                return CountdownService.openLink(linkObj.key);
            });
        };
    });