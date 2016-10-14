var app = angular.module('plunker', ['nvd3']);

const CHART = document.getElementById("lineChart");


app.controller('MainCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    $scope.getChargeData = function() {
        $http.get("/socdata").success(function(response) {
            console.log(response);
            $scope.processChargeData(response);
        });
    };

    var stop;
    $scope.refresh = function() {
        // Don't start a new fight if we are already fighting
        if (angular.isDefined(stop)) return;
        $scope.getChargeData();
        stop = $interval(function() {
            // console.log("refreshing...");
            $scope.getChargeData();
        }, 1000);
    };

    $scope.stopRefresh = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    $scope.refresh();


    $scope.maxCurrent = 10000;
    $scope.processChargeData = function(rawData) {
        var arrayLength = rawData.length;
        var cur = [];
        var sum = 0;
        var sumArr = [];
        for (var i = arrayLength - 1; i >= 0; i--) {
            var row = [];
            var sumRow = [];
            var chCur = rawData[i].ch_cur;
            var current = 0;
            if (chCur >= 100) {
                current = 1000 * chCur / 4095;
            }


            sum += current;
            row.push(new Date(rawData[i].timestp).getTime());
            row.push(Number(current).toFixed(2));
            sumRow.push(new Date(rawData[i].timestp).getTime());
            sumRow.push(Number(sum * 3).toFixed(2));
            //Do something
            cur.push(row);
            sumArr.push(sumRow);
        }
        $scope.maxCurrent = sumArr[arrayLength - 1][1];
        $scope.tmp = rawData[arrayLength - 1].temperature + "℃";
        var now_curr = cur[arrayLength - 1][1];
        if(now_curr < 10){
            $scope.chargeClass = 'label-default';
            $scope.charging = 'Not Charging';
        } else {
            $scope.chargeClass = 'label-success';
            $scope.charging = 'Charging';
        }

        $scope.pushChargeData(cur, sumArr);
    }


    $scope.pushChargeData = function(currents, currentSum) {

        let lineChart = new Chart(CHART,{
            type: 'line',
            data: {
                //labels will determine the length of the chart
                labels: ["January", "February", "March", "April", "May", "June", "July", "August", "Sep"],
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40, 50, 30],
                        spanGaps: false,
                    },
                    {
                        label: "My second dataset",
                        fill: true, // fill color
                        lineTension: 0.2,//sharp or smooth on the line.
                        backgroundColor: "rgba(75,75,192,0.4)",
                        borderColor: "rgba(75,72,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,72,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,72,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [100, 20, 60, 20, 80, 55, 90, 20, 40],
                        spanGaps: false,
                    }
                ]
            },
            options : {
                scales: {
                    yAxes:[{
                        ticks: {
                            beginAtZero : true  
                        }
                    }]
                }
            }
        });
    }

    $scope.pushChargeData(); 

}]);
