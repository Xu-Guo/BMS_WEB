var app = angular.module('plunker', ['nvd3']);

const CHART = document.getElementById("lineChart");


<<<<<<< HEAD
app.controller('MainCtrl', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
    $scope.getCurrentData = function () {
        $http.get("/currentdata").success(function (response) {
            console.log(response);
            $scope.processCurrentData(response);
        });
    };

    var stop;
    $scope.refresh = function () {
        // Don't start a new fight if we are already fighting
        if (angular.isDefined(stop)) return;
        $scope.getCurrentData();
        stop = $interval(function () {
=======
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
<<<<<<< HEAD

    $scope.stopRefresh = function () {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    };

    $scope.getIntialData = function () {

        console.log("getInialData");
        $http.get("/initialcurrentdata").success(function (response) {
            console.log(response);
            $scope.processInitialCurrentData(response);
=======
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
>>>>>>> master
            $scope.drawCurrentChart();
        });
    };
<<<<<<< HEAD


    $scope.initialx = [];
    $scope.initialy = [];
    // for(var i=0; i<=19; i++){
    //     $scope.initialx[i] = i;
    //     $scope.initialy[i] = i;
    // }
    $scope.processInitialCurrentData = function (rawData) {
        var len = rawData.length;
        for (var i = 0; i < len - 1; i++) {

            $scope.initialx[i] = new Date(rawData[i].timestp).getTime();

            if (Number(rawData[i].battery_status) == 2) {
                $scope.initialy[i] = 0 - Number(rawData[i].dis_cur);
            } else if (Number(rawData[i].battery_status) == 1) {
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
    var lateststatus;


    $scope.processCurrentData = function (rawData) {
        lateststatus = rawData[0].battery_status;
        var pidNew = Number(rawData[0].id);

        if (pidNew == pidOld) {
            return;
        }
        gotNewDataFlag = 1;
        time = new Date(rawData[0].timestp).getTime();
        if (Number(rawData[0].battery_status) == 2) { //discharge
            value = 0 - Number(rawData[0].dis_cur);
        } else if (Number(rawData[0].battery_status) == 1) {//charging
            value = Number(rawData[0].ch_cur);
=======
    $scope.stopRefresh = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
>>>>>>> master
        }
        pidOld = pidNew;
        console.log("iam here wwwwwwwwwwwwwwwwwwww");
    };
<<<<<<< HEAD

    $scope.drawCurrentChart = function () {

=======
    $scope.drawCurrentChart = function() {
>>>>>>> master

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
<<<<<<< HEAD
                        setInterval(function () {
                            $scope.refresh();

                            if (gotNewDataFlag == 1) {
                                console.log(" i m here!!@!@!@!@!");
                                x = time;
                                y = value;
                                gotNewDataFlag = 0;
                            } else {
                                if (lateststatus != 0) {
                                    y = value;
                                } else {
                                    y = 0;
                                }
                                x = (new Date()).getTime();// current time
                            }

=======
                        setInterval(function() {
                            $scope.refresh();
                            if (gotNewDataFlag==1) {
                                x = singleData.time;
                                y = singleData.value;
                                console.log("-------New data x:" + x + "val:" + y);
                                gotNewDataFlag =0;
                            } else {
                                x = (new Date()).getTime();
                                if (lastestStatus!=0) y = singleData.value;
                                else y = 0;
                                console.log("^^^^^^No new data x:" + x + "val:" + y);
                            }
>>>>>>> master
                            series.addPoint([x, y], true, true);
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
