var app = angular.module('plunker', ['nvd3']);

const CHART = document.getElementById("lineChart");

app.controller('MainCtrl', ['$scope', '$http', '$interval', function($scope, $http, $interval) {
    var gotNewDataFlag=0;
    var pidOld = 0;
    var time;
    var value;
    var x;
    var y;
    var DisplayData = [];
    var pirate = [];
    var index = 0;
    var singleData = {"time":(new Date()).getTime(),"value":0};
    var lastestStatus;

    $scope.getCurrentData = function() {
        $http.get("/currentdata").success(function(response) {
            // console.log("Get data from server and Ready to process");
            $scope.processCurrentData(response[0]);
        });
    };
    $scope.processCurrentData = function(rawData) {
        var pidNew = Number(rawData.id);
        lastestStatus = rawData.battery_status;
        // console.log("check PID pidNew:"+pidNew+"pidOld:"+pidOld);
        if (pidNew <= pidOld) return{"time": (new Date()).getTime(), "value":singleData.value};
        time = new Date(rawData.timestp.replace(' ', 'T')).getTime();
        if (Number(rawData.battery_status) == 2) { //discharge
            value = 0 - Number(rawData.dis_cur);
        } else if (Number(rawData.battery_status) == 1) { //charging
            value = Number(rawData.ch_cur);
        }
        singleData.time = time;
        singleData.value = value;
        pidOld = pidNew;
        gotNewDataFlag = 1;
        // console.log("^^^^^^^check time:"+time+"value:"+value);
        return {"time":time, "value":value};
    }
   // var stop;
    $scope.refresh = function() {
        // Don't start a new fight if we are already fighting
        //if (angular.isDefined(stop)) return;
        // $scope.getCurrentData();
        /*stop = $interval(function() {
>>>>>>> master
            // console.log("refreshing...");
            $scope.getCurrentData();
        }, 2000);*/
        $interval(function() {
             // console.log("refreshing...");
            $scope.getCurrentData();
        }, 2000);
    };
    $scope.processInitCurrentData = function(rawData){
        //var temp = [];
        rawData.reverse();
        for(var i=0; i<rawData.length; i++){
            var cur = $scope.processCurrentData(rawData[i]);
            DisplayData.push(cur);
         // console.log("##############timestamp:"+DisplayData[i].time+"value:"+DisplayData[i].value);
        }
        // DisplayData.reverse();
    }
    $scope.getInitalCurrentData = function() {
        $http.get("/currentdata").success(function(response) {
            console.log("Initial data from server and Ready to process");
            $scope.processInitCurrentData(response);
            $scope.drawCurrentChart();
        });
    };
    $scope.stopRefresh = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
        pidOld = pidNew;
        console.log("iam here wwwwwwwwwwwwwwwwwwww");
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
                    load: function() {

                        // set up the updating of the chart each second
                        var series = this.series[0];
                        setInterval(function() {
                            $scope.refresh();
                            if (gotNewDataFlag==1) {
                                x = singleData.time;
                                y = singleData.value;
                                console.log("-------New data x:" + x + "val:" + y);
                                gotNewDataFlag =0;
                                series.addPoint([x, y], true, true);
                            }
                            //else {
                            //     x = (new Date()).getTime();
                            //     if (lastestStatus!=0) y = singleData.value;
                            //     else y = 0;
                            //     console.log("^^^^^^No new data x:" + x + "val:" + y);
                            // }

                        }, 1000);
                    }
                }
            },


            title: {
                text: 'Real-Time Current Information'
            },
            xAxis: {
                type: 'datetime',
                // tickPixelInterval: 150
                tickPixelInterval: 1000
            },
            yAxis: {
                title: {
                    text: 'Current(mA)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },

            tooltip: {
                formatter: function() {
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


            /*  series: [{
                  name: 'Random data',
                  data: (function () {
                      // generate an array of random data
                      var data = [],
                          time = (new Date()).getTime(),
                          i;

                      for (i = -19; i <= 0; i += 1) {
                          data.push({
                              x: time + i * 1000,
                              y: Math.random()
                          });
                      }
                      return data;
                  }())
              }]*/
            /*series: [{
                    name: 'Random data',
                    data: (function() {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;

                        for (i = -19; i <= 0; i += 1) {
                            data.push({
                                x: time + i * 1000,
                                y: i
                            });
                        }
                        return data;
                    }())
                }]*/
            /* series: [{
                  name: 'Real data',
                  data: ($scope.initChart())
              }]*/
            series: [{
                name: 'Real data',
                data: (function() {
                    var data = [];
                    for (index = 0; index < DisplayData.length; index++) {
                        data.push({
                            x: DisplayData[index].time,
                            y: DisplayData[index].value
                        });
                        console.log("---------timestamp:"+DisplayData[index].time+"value:"+DisplayData[index].value);
                    }
                    return data;
                }())

            }]


        });
    }

    $scope.getInitalCurrentData();
}]);
