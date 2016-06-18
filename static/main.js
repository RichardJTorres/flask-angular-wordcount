(function () {

  'use strict';

  angular.module('WordcountApp', [])

    .controller('WordcountController', ['$scope', '$log', '$http', '$timeout',
      function ($scope, $log, $http, $timeout) {
        $scope.getResults = function () {
          $log.log("test");
          var userInput = $scope.url;
          $http.post('/start', {'url': userInput})
            .success(function (results) {
              getWordCount(results);

              $log.log(results)
            })
            .error(function (error) {
              $log.log(error)
            });

        };
        function getWordCount(jobID) {

          var timeout = "";

          var poller = function () {
            // fire another request
            $http.get('/results/' + jobID).success(function (data, status, headers, config) {
              if (status === 202) {
                $log.log(data, status);
              } else if (status === 200) {
                $log.log(data);
                $scope.wordcounts = data;
                $timeout.cancel(timeout);
                return false;
              }
              // continue to call the poller() function every 2 seconds
              // until the timeout is cancelled
              timeout = $timeout(poller, 2000);
            });
          };
          poller();
        }
      }


    ]);

}());