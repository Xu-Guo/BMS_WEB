var app = angular.module('plunker', ['nvd3']);

const CHART = document.getElementById("lineChart");


app.controller('MainCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    $scope.getChargeData = function() {
        $http.get("/socdata").success(function(response) {
           // console.log(response);
            $scope.processChargeData(response);
            $scope.displaySoc();
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

   // $scope.refresh();


    $scope.maxCurrent = 10000;
    var chargeData = [];

    $scope.processChargeData = function(rawData) {
        var time;
        var socValue;
        for(var i=0; i<rawData.length; i++){
            time = (new Date(rawData[i].timestp.replace(' ', 'T'))).getTime();
             // time = (new Date()).getTime()+i*1000;
            socValue = rawData[i].stateofcharge;
            chargeData.push({"time":time, "socValue":socValue}); 

        }
        chargeData.reverse();
    }

    $scope.displaySoc = function(){
        var value = [];
        for(var i=0; i<chargeData.length; i++){

        console.log("data, time:"+chargeData[i].time+"value: "+chargeData[i].socValue);
        value.push(chargeData[i].socValue);
        }
        $('#container').highcharts({
            chart: {
                zoomType: 'x'
            },
            title: {
                text: 'USD to EUR exchange rate over time'
            },
            subtitle: {
                text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Exchange rate'
                }
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [{
                type: 'area',
                name: 'StateOfCharge',
                data: (function() {
                    var data = [];
                    for (var index = 0; index < chargeData.length; index++) {
                        data.push({
                            x: chargeData[index].time-25200000, 
                            // time zone of Date in Javascript is GMT, our local time is 7hours later,
                            //which is 25200000
                            y: chargeData[index].socValue
                        });
                        console.log("---------timestamp:"+chargeData[index].time+"value:"+chargeData[index].socValue);
                    }
                    return data;
                }())
            }]
        });
        
    }

    $scope.getChargeData();
}]);
