var app = angular.module('plunker', ['nvd3']);

const CHART = document.getElementById("lineChart");


app.controller('MainCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    $scope.getDischargeData = function() {
        $http.get("/dischargedata").success(function(response) {
            //console.log(response);
            $scope.processDischargeData(response);
        });
    };

    var stop;
    $scope.refresh = function() {
        // Don't start a new fight if we are already fighting
        if (angular.isDefined(stop)) return;
        $scope.getDischargeData();
        stop = $interval(function() {
            // console.log("refreshing...");
            $scope.getDischargeData();
        }, 10000);
    };

    $scope.stopRefresh = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };
    $scope.getDischargeData();
    //$scope.refresh();

//procesing data here
    $scope.processDischargeData = function(rawData) {
        var arrayLength = rawData.length;
        var disCur = [];
        var tstp =[];
        tstp[0] = 0;
        var charge = [];
        charge[0] = 0;
        
        for (var i = 0; i < arrayLength; i++) {
            tstp[i] = new Date(rawData[i].timestp).getTime()/ 1000;
            disCur[i] = rawData[i].dis_cur;
        }

        var xlable = [];
        xlable[0] = 0;
        var total = [];
        total[0] = 0;

        var count = 0;
        var j = 0;
        var sum = 0;
        for (var i = 1; i < arrayLength; i++) {
            var chop = (arrayLength/10).toFixed(0);
            charge[i] = disCur[i] * (tstp[i] - tstp[i-1]);
            sum += charge[i];
            if ((count % chop) == 0 || count == arrayLength - 1){
                total[j] = 520000 - sum;
                xlable[j] = new Date(rawData[i].timestp).toLocaleTimeString();
                j++;
            }
            count++;

        }

        $scope.tmp = rawData[arrayLength - 1].temperature + "℃";
        var now_battery_status = rawData[arrayLength - 1].battery_status;
        if(Number(now_battery_status) == 2){
            $scope.chargeClass = 'label-default';
            $scope.charging = 'Not Charging';
        } else {
            $scope.chargeClass = 'label-success';
            $scope.charging = 'Charging';
        }

        $scope.pushDischargeData(xlable, total);
    }


    $scope.pushDischargeData = function(timestp, totalcharge) {

        let lineChart = new Chart(CHART,{
            type: 'line',
            data: {
                //labels will determine the length of the chart
                // labels: ["January", "February", "March", "April", "May", "June", "July", "August", "Sep"],
                labels : timestp,
                datasets: [
                    {
                        label: "My First dataset",
                        fill: true,
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
                        //data: [65, 59, 80, 81, 56, 55, 40, 50, 30],
                        data:  totalcharge,
                        spanGaps: false,
                    }
                    // {
                    //     label: "My second dataset",
                    //     fill: true, // fill color
                    //     lineTension: 0.2,//sharp or smooth on the line.
                    //     backgroundColor: "rgba(75,75,192,0.4)",
                    //     borderColor: "rgba(75,72,192,1)",
                    //     borderCapStyle: 'butt',
                    //     borderDash: [],
                    //     borderDashOffset: 0.0,
                    //     borderJoinStyle: 'miter',
                    //     pointBorderColor: "rgba(75,72,192,1)",
                    //     pointBackgroundColor: "#fff",
                    //     pointBorderWidth: 1,
                    //     pointHoverRadius: 5,
                    //     pointHoverBackgroundColor: "rgba(75,72,192,1)",
                    //     pointHoverBorderColor: "rgba(220,220,220,1)",
                    //     pointHoverBorderWidth: 2,
                    //     pointRadius: 1,
                    //     pointHitRadius: 10,
                    //     data: [100, 20, 60, 20, 80, 55, 90, 20, 40],
                    //     spanGaps: false,
                    // }
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

    //$scope.pushDischargeData(); 

}]);
