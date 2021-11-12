(function () {
  "use strict";
  window.APP_HELPERS = {
    getCovidAppConfig: function () {
      var configUrl = '/covid-web/config.json';
      return fetch(configUrl, {
        method: 'GET',
        credentials: "include",
      }).then(function (response) {
        return response.json();
      })
    }
  }
})();
