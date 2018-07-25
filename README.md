# magento2-knockout-chart

# Open Url
http://example.com/pulsestorm_knockouttutorial/

# More Example 
http://www.chartjs.org/docs/latest/charts/

# Here this repo Explain 

Many time we need to create own graph but in magento 2 here knockout is using i will try how can we create a chart in magento 2 


# I am try with two types of graph
# Template file code

<div id="line-example">
	<h2>Simple Line Chart Example</h2>
	<!-- <pre data-bind="text: ko.toJSON(SimpleLineData, null, 2)"></pre> -->
	<canvas id="some-simple-line-chart"
			data-bind="chart: { type: 'line', data: SimpleLineData }"></canvas>
	<p>The above chart is generated using the data in the view model and rendered into the canvas</p>
</div>

<div id="dynamic-doughnut-example">
	<h2>TRIPLE D - WUT WUT - Dynamic Doughnut Data!</h2>
	<canvas id="some-dynamic-doughnut-chart"
			data-bind="chart: { type: 'doughnut', data: DynamicDoughnutData, options: { observeChanges: true, throttle: 1000 } }"></canvas>
	<p>The above chart is generated dynamically using the data in the view model and rendered into the canvas</p>
	<p>If you change any of the values beneath the chart will update to reflect them every second</p>
	<label>Red</label><input type="number" data-bind="value: RedValue" />
	<label>Green</label><input type="number" data-bind="value: GreenValue" />
	<label>Yellow</label><input type="number" data-bind="value: YellowValue" />
</div>

# Load ViewModel by Knockout configurable ViewModel
<div  data-bind="scope: 'chartscope'"> 
	<!-- ko template: getTemplate() --><!-- /ko -->
</div>
<script type="text/x-magento-init">
        {
            "*": {
                "Magento_Ui/js/core/app": {
                    "components": {
                        "chartscope": {
                            "component": "Pulsestorm_KnockoutTutorial/js/chart"
                        }
                    }
                }
            }
        }
</script>

# Js Binding



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



There is a libray file need to load by require config js.You can download this module or easily integrate with any modeul by change Vendor name nad Namespace.

