var app = angular.module('plunker', ['nvd3']);

const CHART = document.getElementById("lineChart");


app.controller('MainCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    $scope.getCurrentData = function() {
        $http.get("/currentdata").success(function(response) {
            console.log(response);
            //$scope.processCurrentData(response);
        });
    };

    var stop;
    $scope.refresh = function() {
        // Don't start a new fight if we are already fighting
        if (angular.isDefined(stop)) return;
        $scope.getCurrentData();
        stop = $interval(function() {
            // console.log("refreshing...");
            $scope.getCurrentData();
        }, 500);
    };

    $scope.stopRefresh = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    $scope.getIntialData = function () {

        console.log("getInialData");
        $http.get("/initialcurrentdata").success(function(response) {
            console.log(response);
            $scope.processInitialCurrentData(response);
            $scope.drawCurrentChart();

        });
    };


    $scope.initialx = [];
    $scope.initialy = [];
    // for(var i=0; i<=19; i++){
    //     $scope.initialx[i] = i;
    //     $scope.initialy[i] = i;
    // }
    $scope.processInitialCurrentData = function (rawData) {
        var len = rawData.length;
        for(var i = 0; i < len - 1; i++){

            $scope.initialx[i] = new Date(rawData[i].timestp).getTime();

            if(Number(rawData[i].battery_status) == 2){
                $scope.initialy[i] = 0 - Number(rawData[i].dis_cur);
            }else if(Number(rawData[i].battery_status) == 1){
                $scope.initialy[i] = Number(rawData[i].ch_cur);
            }

        }
        console.log($scope.initialx);
        console.log($scope.initialy);
    };

    var gotNewDataFlag;
    var pidOld = 0;
    var time;
    var value;
    var x;
    var y;


    $scope.processCurrentData = function(rawData) {
        var pidNew = Number(rawData[0].id);
        if(pidNew == pidOld){
            return;
        }
        gotNewDataFlag = 1;
        time = new Date(rawData[0].timestp).getTime();
        if(Number(rawData[0].battery_status) == 2){ //discharge
            value = 0 - Number(rawData[0].dis_cur);
        }else if(Number(rawData[0].battery_status) == 1){//charging
            value = Number(rawData[0].ch_cur);
        }
    };

    $scope.drawCurrentChart = function() {

            
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        $('#container').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function () {
                            //$scope.refresh();
                            if(gotNewDataFlag == 1){
                                x = time;
                                y = value;
                            }
                            x = (new Date()).getTime(), // current time
                            series.addPoint([x, y], true, true);
                        }, 100000);
                    }
                }
            },


            title: {
                text: 'Live random data'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },

            legend: {
                enabled: false
            },

            exporting: {
                enabled: false
            },


            series: [{
                name: 'Random data',
                data: (function () {
                    //generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    console.log("check data");
                    console.log($scope.initialx);
                    console.log($scope.initialy);

                    for (i = 0; i <= 10; i++) {
                        data.push({
                            x: $scope.initialx[i],
                            y: $scope.initialy[i]
                        });

                    }
                    return data;
                }())

            }]


        });
        //console.log("aaa");
    }

    //$scope.refresh();
    $scope.getIntialData();
    //$scope.drawCurrentChart();


}]);
