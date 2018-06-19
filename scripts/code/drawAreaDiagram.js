/** 
* Marc Moorman
* 10769781
* file containing the function to draw a polar area diagram
**/

var svgAreaDiagram;

// function to draw the area polar diagram
function drawAreaPolarDiagram() {

    document.getElementById("titleAreaDiagram").innerHTML = "The planets in " + year;

    if (svgAreaDiagram != undefined) {
        d3.selectAll("#svgAreaDiagram").remove();
    }

	// retrieving needed data for diagram
	var areaDiagramData = getAreaDiagramData();
    var findingsPerMethod = areaDiagramData[0];
	var methodsUsed = areaDiagramData[1];
	// console.log(findingsPerMethod)
	// console.log(methodsUsed)

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


    var woord = "marcmarcmarc"
    console.log("index string:", woord.slice(1,5))

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
            d3.select("#scatterplot")
                .selectAll(method)
                .style("fill", function(d, i){  
                    if (planetsYear[i]["eccentricity"] > 0.0167) {
                        console.log("in if eccentricity") 
                        return "#e6550d";}
                    else {
                        console.log("else eccentricity") 
                        return "#636363";}
                    })
                .attr("r", function(d, i){
                    if (planetsYear[i]["radius"] != "") {
                        console.log("in if radius")
                        return planetsYear[i]["radius"] * 5;
                    }
                    else {
                        console.log("else of radius")
                        return 3;
                    }  
                })
            })
		.on("mouseover", polarTip.show)
		.on("mouseout", polarTip.hide);
    slices.exit().remove();

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
function updateAreaDiagram() {

	drawAreaPolarDiagram();
};