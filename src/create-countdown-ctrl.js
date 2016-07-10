angular
    .module('countdownSync')
    .controller('CreateCountdownCtrl', function (CountdownService) {
        var ctrl = this;

        // Create a countdown link
        ctrl.createCountdownLink = function () {
            return CountdownService.createLink().then(ctrl.openCountdownLink_);
        };

        // Redirect the browser to a specified countdown link object
        ctrl.openCountdownLink_ = function (linkObj) {
            return CountdownService.openLink(linkObj.$id);
        };
    });