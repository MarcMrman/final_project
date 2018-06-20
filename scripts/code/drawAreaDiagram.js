/** 
* Marc Moorman
* 10769781
* file containing the function to draw a polar area diagram
**/

// global variable
var svgAreaDiagram;

// function to draw the area polar diagram
function drawAreaPolarDiagram() {

    // adding title to html
    document.getElementById("titleAreaDiagram").innerHTML = "The planets in " + year;

    if (svgAreaDiagram != undefined) {
        d3.selectAll("#svgAreaDiagram").remove();
    };

	// retrieving needed data for diagram
	var areaDiagramData = getAreaDiagramData();
    var findingsPerMethod = areaDiagramData[0];
	var methodsUsed = areaDiagramData[1];

	// characteristics for svg and diagram
	var outerWidth = 600;
    var outerHeight = 400;
    var margin = { left: 11, top: 75, right: 100, bottom: 88 };
    var radiusMax = 150;

    // setting characteristics for inside the diagram
    var innerWidth  = outerWidth  - margin.left - margin.right;
    var innerHeight = outerHeight - margin.top  - margin.bottom;

    // creating svg element
    svgAreaDiagram = d3.select("#containerAreaDiagram")
    	.append("svg")
    	.attr("id", "svgAreaDiagram")
        .attr("width",  outerWidth)
        .attr("height", outerHeight);
    var g = svgAreaDiagram.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // append g for chart
    var pieG = g.append("g");
    // append g for legend
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
    		"<strong>Found:</strong> <span style='color:black'>" + findingsPerMethod[i] + "</span>" + "<br>"
        });
	svgAreaDiagram.call(polarTip);

    // setting domain for g elements
    radiusScale.domain([0, d3.max(findingsPerMethod)]);
    colorScale.domain(methodsUsed);

    // pie returns 1 to make it constant
    var pie = d3.pie().value(function (){ return 1; });
    
    // setting height of slices, making it a polar area diagram
   	var arc = d3.arc().outerRadius(function(d) { 
    	return radiusScale(d.data);
    });
    arc.innerRadius(function(d){
    	return 0;
    });
    
    // position g's for chart elements
	pieG.attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");

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
    	    var method = "circle#" + methodsUsed[i];
            d3.select("#scatterplot")
    			.selectAll(method)
    			.style("fill", "#000000")
                .attr("r", 7);})
        .on("mouseleave", function(d, i) {
            var method = "circle#" + methodsUsed[i];
            // terug kleuren gaat niet goed
            d3.select("#scatterplot")
                .selectAll(method)
                .attr("r", function(d, i){
                    if (planetsYear[i]["radius"] != "") {
                        return planetsYear[i]["radius"] * 5;
                    }
                    else {
                        return 3;
                    }
                })
                .style("fill", function(d, i){  
                    if (planetsYear[i]["eccentricity"] > 0.0167) {
                        return "#016450";
                    }
                    else {
                        return "#636363";
                    }
                });
            })
        .on("mouseover", polarTip.show)
		.on("mouseout", polarTip.hide);
    slices.exit().remove();

    // calling legend
    colorLegendG.call(colorLegend);
};

// retrieve data for year clicked on
function getAreaDiagramData() {

	var methods = [];

	// filetering out needed data
	for (var i = 0; i < data.data.length; i ++) {
		if (data.data[i]["discovered"] == year) {
			methods.push(data.data[i]["detection_type"]);
		};
	};

    // sort list to get methods in order
    // to make counting easier
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
	};

	return [findingsPerMethod.slice(1,), methodsUsed.splice(0, methodsUsed.length - 1)];
};