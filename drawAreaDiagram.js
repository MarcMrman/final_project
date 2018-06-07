/** 
* Marc Moorman
* 10769781
* file containing the function to draw a nightingale-rose chart
**/

//function drawNightingale(data) {

// console.log(data)

// // set svg properties
// var outerWidth = 960;
// var outerHeight = 500;
// var margin = { left: 11, top: 75, right: 377, bottom: 88 };
// var radiusMax = 231;

// var xColumn = "name";

// var colorColumn = "religion";
// var radiusColumn = "population";

// var innerWidth  = outerWidth  - margin.left - margin.right;
// var innerHeight = outerHeight - margin.top  - margin.bottom;

// // create svg
// var svg = d3.select("body")
// 	.append("svg")
// 	.attr("width",  outerWidth)
// 	.attr("height", outerHeight);

// var g = svg.append("g")
// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var xAxisG = g.append("g")
// 	.attr("class", "x axis")
// 	.attr("transform", "translate(0," + innerHeight + ")");

// var pieG = g.append("g");

// var colorLegendG = g.append("g")
// 	.attr("class", "color-legend")
// 	.attr("transform", "translate(595, -36)");

// var xScale = d3.scaleBand()
// 	.rangeRound([0, innerWidth]);

// var radiusScale = d3.scaleSqrt()
// 	.range([0, radiusMax]);

// var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// var xAxis = d3.axisBottom()
// 	.scale(xScale);
//     //.outerTickSize(0);

// var pie = d3.pie();
// var arc = d3.arc();

// var colorLegend = d3.legend.color()
//     .scale(colorScale)
//     .shapePadding(3)
//     .shapeWidth(40)
//     .shapeHeight(40)
//     .labelOffset(4);
//};

// function drawAreaDiagram(data) {

// 	getAreaDiagramData(data)

//     xScale.domain(data.map( function (d){ return d[xColumn]; }));
    
//     radiusScale.domain([0, d3.max(data, function (d){ 
//     	return d[radiusColumn]; 
//     })]);
    
//     colorScale.domain(data.map(function (d){ 
//     	return d[colorColumn]; 
//     }));

//     pie.value(function (){ return 1; });
//     arc.outerRadius(function(d) { 
//       return radiusScale(d.data[radiusColumn]);
//     });

//     var pieData = pie(data);

//     pieG.attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");

//     var slices = pieG.selectAll("path")
//     	.data(pieData);
    
//     slices.enter()
//     	.append("path");
    
//     slices.attr("d", arc)
//       .attr("fill", function (d){ 
//       		return colorScale(d.data[colorColumn]); 
//     });
    
//     slices.exit().remove();

//     xAxisG.call(xAxis);
    //colorLegendG.call(colorLegend);
//};

function getAreaDiagramData(data, year) {
	console.log(data)
	
	var methods = [];

	for (var i = 0; i < data.data.length; i ++) {
		if (data.data[i]["discovered"] == year) {
			methods.push(data.data[i]["detection_type"]);
			//console.log(data.data[i]["detection_type"])
		};
	};
	//console.log(methods)

	sortedMethods = methods.sort();
	console.log(sortedMethods)

	// looking for amount of findings per year
	var methodsUsed = [];	
	var count = 0;
	var cursor = null;
	for (var i = 0; i < sortedMethods.length; i ++) {

		if (sortedMethods[i] != cursor) {
			methodsUsed.push(sortedMethods[i] + ":" + count);
			cursor = sortedMethods[i];
			count = 1;
		}

		else {
			count += 1;
		}
	}
	console.log(methodsUsed)
}