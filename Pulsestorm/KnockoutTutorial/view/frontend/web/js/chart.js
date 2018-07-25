define(
		[ 'jquery', 'uiComponent', 'ko','libChart'],
		function($, Component, ko) {

			'use strict';


			ko.observableGroup = function(observables) {
		        var observableManager = {};
		        var throttle = 0;
		        var throttleTimeout;

		        observableManager.throttle = function(duration) {
		            throttle = duration;
		            return observableManager;
		        };

		        observableManager.subscribe = function(handler) {
		            function throttledHandler(val) {
		                if(throttle > 0) {
		                    if(!throttleTimeout) {
		                        throttleTimeout = setTimeout(function() {
		                            throttleTimeout = undefined;
		                            handler(val);
		                        }, throttle);
		                    }
		                }
		                else
		                { handler(val); }
		            }

		            for(var i = 0; i < observables.length; i++)
		            { observables[i].subscribe(throttledHandler); }

		            return observableManager;
		        };

		        return observableManager;
		    };

		    var getType = function(obj) {
		        if ((obj) && (typeof (obj) === "object") && (obj.constructor == (new Date).constructor)) return "date";
		        return typeof obj;
		    };

		    var getSubscribables = function(model) {
		        var subscribables = [];
		        scanForObservablesIn(model, subscribables);
		        return subscribables;
		    };

		    var scanForObservablesIn = function(model, subscribables){
		        for (var parameter in model)
		        {
		            var typeOfData = getType(model[parameter]);
		            switch(typeOfData)
		            {
		                case "object": { scanForObservablesIn(model[parameter], subscribables); } break;
		                case "array":
		                {
		                    var underlyingArray = model[parameter]();
		                    underlyingArray.forEach(function(entry, index){ scanForObservablesIn(underlyingArray[index], subscribables); });
		                }
		                break;

		                default:
		                {
		                    if(ko.isComputed(model[parameter]) || ko.isObservable(model[parameter]))
		                    { subscribables.push(model[parameter]); }
		                }
		                break;
		            }
		        }
		    };

		    ko.bindingHandlers.chart = {
		        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
		            var allBindings = allBindingsAccessor();
		            var chartBinding = allBindings.chart;
		            var activeChart;
		            var chartData;

		            var createChart = function() {
		                var chartType = ko.unwrap(chartBinding.type);
		                var data = ko.toJS(chartBinding.data);
		                var options = ko.toJS(chartBinding.options);

		                chartData = {
		                    type: chartType,
		                    data: data,
		                    options: options
		                };

		                activeChart = new Chart(element, chartData);
		            };

		            var refreshChart = function() {
		                chartData.data = ko.toJS(chartBinding.data);
		                activeChart.update();
		                activeChart.resize();
		            };

		            var subscribeToChanges = function() {
		                var throttleAmount = ko.unwrap(chartBinding.options.throttle) || 100;
		                var dataSubscribables = getSubscribables(chartBinding.data);
		                console.log("found obs", dataSubscribables);

		                ko.observableGroup(dataSubscribables)
		                    .throttle(throttleAmount)
		                    .subscribe(refreshChart);
		            };

		            createChart();

		            if(chartBinding.options && chartBinding.options.observeChanges)
		            { subscribeToChanges(); }
		        }
		    };


			return Component
					.extend({
						defaults : {
							template : 'Pulsestorm_KnockoutTutorial/chart'
						},

						initialize : function() {
							this._super();
							this.SimpleLineData = {
									labels: ["January", "February", "March", "April", "May", "June", "July"],
									datasets: [
										{
											label: "Healthy People",
											backgroundColor: "rgba(220,220,220,0.2)",
											borderColor: "rgba(220,220,220,1)",
											pointColor: "rgba(220,220,220,1)",
											pointStrokeColor: "#fff",
											pointHighlightFill: "#fff",
											pointHighlightStroke: "rgba(220,220,220,1)",
											data: [65, 59, 80, 81, 56, 55, 40]
										},
										{
											label: "Ill People",
											backgroundColor: "rgba(151,187,205,0.2)",
											borderColor: "rgba(151,187,205,1)",
											pointColor: "rgba(151,187,205,1)",
											pointStrokeColor: "#fff",
											pointHighlightFill: "#fff",
											pointHighlightStroke: "rgba(151,187,205,1)",
											data: [28, 48, 40, 19, 86, 27, 90]
										}
									]
								};

                            /* Doughnut and Pie */
							this.RedValue = ko.observable(300);
							this.GreenValue = ko.observable(50);
							this.YellowValue = ko.observable(100);
							this.DynamicDoughnutData = {
								labels: ["Red", "Green", "Yellow" ],
								datasets: [
									{
										data: [this.RedValue, this.GreenValue, this.YellowValue],
										backgroundColor: [
											"#FF6384",
											"#36A2EB",
											"#FFCE56"
										],
										hoverBackgroundColor: [
											"#FF6384",
											"#36A2EB",
											"#FFCE56"
										]
									}]
							};
						}
					});
		});
