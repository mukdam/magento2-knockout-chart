# magento2-knockout-chart

# Open Url
http://example.com/pulsestorm_knockouttutorial/

# More Example 
http://www.chartjs.org/docs/latest/charts/

# Here this repo Explain 

Many time we need to create own graph but in magento 2 here knockout is using i will try how can we create a chart in magento 2 

# Also check on 
https://magento.stackexchange.com/questions/235955/how-can-draw-chart-in-knockout-js-in-magento-2

# I am try with two types of graph


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


There is a libray file need to load by require config js.You can download this module or easily integrate with any modeul by change Vendor name nad Namespace.

