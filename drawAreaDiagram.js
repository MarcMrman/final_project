/** 
* Marc Moorman
* 10769781
* file containing the function to draw a nightingale-rose chart
**/

// function drawAreaDiagram(data, year) {

// 	console.log(data)

// 	// get the needed data
// 	var findingsPerMethod = getAreaDiagramData(data, year)[0].slice(1,6)
// 	var methodsUsed = getAreaDiagramData(data, year)[1].slice(0,5)
// 	console.log(findingsPerMethod)
// 	console.log(methodsUsed)
	
// 	// set svg properties
// 	var outerWidth = 960;
// 	var outerHeight = 500;
// 	var margin = { left: 11, top: 75, right: 377, bottom: 88 };
// 	var radiusMax = 231;

// 	var xColumn = "name";

// 	var colorColumn = "religion";
// 	var radiusColumn = "population";

// 	var innerWidth  = outerWidth  - margin.left - margin.right;
// 	var innerHeight = outerHeight - margin.top  - margin.bottom;

// 	// create svg
// 	var svgAreaDiagram = d3.select("#containerAreaDiagram")
// 		.append("svg")
// 		.attr("width",  outerWidth)
// 		.attr("height", outerHeight);

// 	var pie = d3.arc().value().outerRadius(function(findingsPerMethod) { 
//     		return radiusScale(findingsPerMethod[radiusColumn]);
//     })

// 	var g = svgAreaDiagram.append("g")
// 		.data()
// 		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 	var xAxisG = g.append("g")
// 		.attr("class", "x axis")
// 		.attr("transform", "translate(0," + innerHeight + ")");

// 	var pieG = g.append("g");

// 	var colorLegendG = g.append("g")
// 		.attr("class", "color-legend")
// 		.attr("transform", "translate(595, -36)");

// 	var xScale = d3.scaleBand()
// 		.rangeRound([0, innerWidth]);

// 	var radiusScale = d3.scaleSqrt()
// 		.range([0, radiusMax]);

// 	var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// 	var xAxis = d3.axisBottom()
// 		.scale(xScale);
// 	    //.outerTickSize(0);

// 	//render(findingsPerMethod, methodsUsed)
//     var pie = d3.pie();
//     //var arc = d3.arc();

// 	var colorLegend = d3.legendColor()
// 	    .scale(colorScale)
// 	    .shapePadding(3)
// 	    .shapeWidth(40)
// 	    .shapeHeight(40)
// 	    .labelOffset(4);

//     xScale.domain(findingsPerMethod.map( function (d){ return d[xColumn]; })); 
//     radiusScale.domain([0, d3.max(findingsPerMethod, function (d){ return d[radiusColumn]; })]);
//     colorScale.domain(methodsUsed.map(function (d){ return d[colorColumn]; }));

//     // making all the angles of the slices the same 
//     pie.value(function (){ 
//     		return 1; 
//     	});
//     // varying in the heights of the slices, making this a polar area diagram
//     //arc.outerRadius(function(findingsPerMethod) { 
//     //		return radiusScale(findingsPerMethod[radiusColumn]);
//    // });

//     var pieData = arc(findingsPerMethod);

//     // adding slices to svg
//     var slices = pieG.selectAll("path");
    
//     // console.log(d3.pie(findingsPerMethod).length)
//     // console.log(typeof(findingsPerMethod))
    
//     slices.data(pieData)
//     	.enter()
//     	.append("path")
//     	.attr("d", arc)
//     	.attr("fill", function (d){ 
//     		return colorScale(d[colorColumn]); 
//     	});
//     slices.exit().remove();

//     xAxisG.call(xAxis);
//     colorLegendG.call(colorLegend);
// };


function pieChart(data, year){
	var findingsPerMethod = getAreaDiagramData(data, year)[0]
	var methodsUsed = getAreaDiagramData(data, year)[1]
	
	var svg = d3.select("containerAreaDiagrami"),
	    width = +svg.attr("width"),
	    height = +svg.attr("height"),
	    radius = Math.min(width, height) / 2,
	    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var svgAreaDiagram = d3.select("#containerAreaDiagram")
		.append("svg")
		.attr("width",  outerWidth)
		.attr("height", outerHeight);

	var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var pie = d3.pie()
	    .sort(null)
	    .value(function(d) { return 1; });

	var path = d3.arc()
	    .outerRadius(function(findingsPerMethod) { 
    		return radiusScale(findingsPerMethod[radiusColumn]);
    	})

	var label = d3.arc()
	    .outerRadius(radius - 40)
	    .innerRadius(radius - 40);

	var arc = g.selectAll(".arc")
	    .data(pie(findingsPerMethod))
	    .enter().append("g")
	      .attr("class", "arc");

	arc.append("path")
	      .attr("d", path)
	      .attr("fill", function(d) { return color(d.data.age); });

	arc.append("text")
	      .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
	      .attr("dy", "0.35em")
	      .text(function(d) { return d.data.age; });
};





// retrieve data for year clicked on
function getAreaDiagramData(data, year) {
		
	var methods = [];

	for (var i = 0; i < data.data.length; i ++) {
		if (data.data[i]["discovered"] == year) {
			methods.push(data.data[i]["detection_type"]);
			//console.log(data.data[i]["detection_type"])
		};
	};

	sortedMethods = methods.sort();

	// looking for amount of findings per year
	var methodsUsed = [];
	var findingsPerMethod = [];	
	var count = 0;
	var cursor = null;
	for (var i = 0; i < sortedMethods.length + 1; i ++) {

		if (sortedMethods[i] != cursor) {
			methodsUsed.push(sortedMethods[i])
			findingsPerMethod.push(count);
			cursor = sortedMethods[i];
			count = 1;
		}

		else {
			count += 1;
		}
	}

	//console.log(methodsUsed)
	return [findingsPerMethod, methodsUsed];
};