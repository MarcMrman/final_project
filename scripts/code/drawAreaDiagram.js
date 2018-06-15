/** 
* Marc Moorman
* 10769781
* file containing the function to draw a polar area diagram
**/

// function to draw the area polar diagram
function drawAreaPolarDiagram(data, year) {

	// retrieving needed data for diagram
	var findingsPerMethod = getAreaDiagramData(data, year)[0];
	var methodsUsed = getAreaDiagramData(data, year)[1];
	// console.log(findingsPerMethod)
	// console.log(methodsUsed)

	// characteristics for svg and diagram
	var outerWidth = 500;
    var outerHeight = 300;
    var margin = { left: 11, top: 75, right: 100, bottom: 88 };
    var radiusMax = 100;

    // setting characteristics for inside the diagram
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;

    // creating svg element
    var svgAreaDiagram = d3.select("#containerAreaDiagram")
    	.append("svg")
    	.attr("id", "svgAreaDiagram")
        .attr("width",  outerWidth)
        .attr("height", outerHeight);
    var g = svgAreaDiagram.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // g #2 for chart
    var pieG = g.append("g");
    // g #3 for legend
    var colorLegendG = g.append("g")
    	.attr("class", "color-legend")
        .attr("transform", "translate(350, -36)");

    // scaling for the g elements
    var radiusScale = d3.scaleSqrt().range([0, radiusMax]);
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // var for legend colors
    var colorLegend = d3.legendColor()
        .scale(colorScale)
        .shapePadding(3)
        .shapeWidth(20)
        .shapeHeight(20)
        .labelOffset(4);

    // creating info window
    var polarTip = d3.tip()
		.attr("class", "d3-tip")
    	.offset([0, 20]).html(function(d, i) {
    		return "<strong>Method:</strong> <span style='color:black'>" + methodsUsed[i] + "</span>" + "<br>" +
    		"<strong>Found:</strong> <span style='color:black'>" + findingsPerMethod[i] + "</span>" + "<br>"});
	svgAreaDiagram.call(polarTip);

    // setting domain for g elements
    radiusScale.domain([0, d3.max(findingsPerMethod)]);
    colorScale.domain(methodsUsed);

    // pie returns 1 to make it constant
    var pie = d3.pie().value(function (){ return 1; });
    
    // here the heights of the chart elements will differ, and making it a polar are diagram
   	var arc = d3.arc().outerRadius(function(d) { 
    	return radiusScale(d.data);
    });
    arc.innerRadius(function(d){
    	return 0;
    });
    
    // position g's for chart elements
	pieG.attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");

	// append title to graph
	svgAreaDiagram.append("text")
		.attr("class", "title")
	    .attr("y", 15)
	    .attr("x", margin.left + 10)
	    .text("Methods used to find planets in " + year);

	// creating paths in diagram
    var slices = pieG.selectAll("path")
    	.data(pie(findingsPerMethod))
    	.enter()
    	.append("path")
		.attr("d", arc)
    	.attr("fill", function (d, i){ 
    		return colorScale(methodsUsed[i]); 
    	})
    	.on("mouseenter", function(d, i) {
    		console.log("in mouseenter")
    		var method = planetsYear[i]["detection_type"];
    		console.log("detection type planet", method)
    		console.log("detection on area gram", methodsUsed[i])
    		if (method == methodsUsed[i]) {
    			console.log("in if statement")
    			d3.select("svgScatterplot")
    			.selectAll(planetsYear)
    			.style("fill", "#000000");}
    	})
		.on("mouseover", polarTip.show)
		.on("mouseout", polarTip.hide);
    slices.exit().remove();

    colorLegendG.call(colorLegend);
};


// retrieve data for year clicked on
function getAreaDiagramData(data, year) {

	var methods = [];

	// filetering out needed data
	for (var i = 0; i < data.data.length; i ++) {
		if (data.data[i]["discovered"] == year) {
			methods.push(data.data[i]["detection_type"]);
		};
	};

	sortedMethods = methods.sort();

	// looking for amount of findings per year
	var methodsUsed = [];
	var findingsPerMethod = [];	
	var count = 0;
	var cursor = null;
	for (var i = 0; i < sortedMethods.length + 1; i ++) {

		// counting duplicate in array for amount
		if (sortedMethods[i] != cursor) {
			methodsUsed.push(sortedMethods[i]);
			findingsPerMethod.push(count);
			cursor = sortedMethods[i];
			count = 1;
		}

		else {
			count += 1;
		}
	}

	return [findingsPerMethod.slice(1,), methodsUsed.splice(0, methodsUsed.length - 1)];
};

// update polar area diagram when clicked on bar chart
function updateAreaDiagram(data, year) {

	d3.selectAll("#svgAreaDiagram").remove();
	drawAreaPolarDiagram(data, year);
};