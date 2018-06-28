/** 
* Marc Moorman
* 10769781
* file containing the function to draw a bar chart
**/

function getBarData() {
// function that gathers data for year clicked on

	// collecting years' discoveries
	var years = [];
	for (var i = 0; i < data.data.length; i ++) {
		var year = data.data[i]["discovered"];
		years.push(year);
	};
	
	/** * sort list to get methods in order
		* to make counting duplicates easier **/
	sortedYears = years.sort();
	
	// collecting years for x-axis
	var yearsFound = [];
	for (var i = 0; i < sortedYears.length - 1; i ++) {
		if (years[i] != years[i + 1]) {
			yearsFound.push(years[i]);
		};
	};

	var findingsPerYear = [];	
	var count = 0;
	var cursor = null;

	// counting duplicates for findings per year
	for (var i = 0; i < sortedYears.length; i ++) {
		if (years[i] != cursor) {
			findingsPerYear.push(count);
			cursor = sortedYears[i];
			count = 1;
		}
		else {
			count += 1;
		}
	};

	/** * lists are sliced to get rid of 2018 (no findings), the first count( which is 0) pushed to findingsPerYear
		* and to get the corresponding values on the right indexes in both lists **/
	return [findingsPerYear.slice(1, 20), yearsFound.slice(0, 20)];
};

function drawBarChart() {
// function that draws a bar chart on a SVG
	
	// adding title to bar chart
    document.getElementById("titleBarChart").innerHTML = "The development of" +
    " planet discovery over the years";

	var barData = getBarData();
	var findingsPerYear = barData[0];
	var yearsFound = barData[1];

	// characteristics for SVG element
	var width = 800;
	var height = 500;
	var barPadding = 5;
	var margin = {left: 50, top: 10, right: 35, bottom: 50};
	var maxRgb = 255;

	// scaling for x-axis to the years with a discovery
 	var scaleXBar = d3.scaleBand()
 		.rangeRound([margin.left, width])
 		.padding(0.1)
 		.domain(yearsFound);

 	// scaling y-axis using nice to round up the axis length
	var scaleYBar = d3.scaleLinear()
		.domain([d3.max(findingsPerYear), 0])
		.nice()
		.range([margin.top, height - margin.bottom]);

	/** * axes characteristics
		* tickformat removes the commas from thousands **/
	var x_axis = d3.axisBottom()
		.scale(scaleXBar)
		.tickFormat(d3.format("d"));	

	var y_axis = d3.axisLeft()
		.scale(scaleYBar);
	
	// create SVG element
	var svgBarChart = d3.select("#containerBarChart")
        .append("svg")
        .attr("id", "barChart")
        .attr("width", width)
        .attr("height", height);
	
	// creating info window for bar chart
	var barTip = d3.tip()
		.attr("class", "d3-tip")
	    .offset([-20, 0]).html(function(d, i) {
    		return "<strong>Year:</strong> <span style='color:black'>" + 
    		yearsFound[i] + "</span>" + "<br>" +
			"<strong>Discoveries:</strong> <span style='color:black'>" + 
			findingsPerYear[i] + "</span>" + "<br>" 
		});
	svgBarChart.call(barTip);

	// creating bars in bar chart
	var bars = svgBarChart.selectAll("rect")
	   .data(findingsPerYear)
	   .enter()
	   .append("rect");

	// making bars fly in with transition and scale rectangles
	bars.transition()
		.duration(1000)
	   	.attr("class", "rect")
	   	.attr("x", function(d, i) {
	   		return scaleXBar(yearsFound[i]);
		})
		.attr("y", function(d, i) {
	   		return scaleYBar(findingsPerYear[i]);
	    })
		.attr("width", scaleXBar.bandwidth())
		.attr("height", function(d, i) {
	   		return height - scaleYBar(findingsPerYear[i]) - margin.bottom;
	    })
	    .attr("fill", function(d) {
            return "rgb(" + (Math.round(maxRgb - d)) + ", 0, 0)";
        });
	
	/** * when clicked on a bar update area diagram and scatter plot
		* show tool tip when hovered over
		* scroll down automatically to other diagrams when clicked on a bar	**/
	bars.on("mouseover", barTip.show)
	    .on("mouseout", barTip.hide)
	    .on("click", function(d, i) {
			year = yearsFound[i];
			drawAreaPolarDiagram();
			drawScatterplot();
			$("html, body").animate({
		        scrollTop: $("#containerScatterplot").offset().top}, "slow");
		});

	// drawing axes
	svgBarChart.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
	    .call(x_axis)
	    .selectAll("text")
	    .attr("y", 0)
	    .attr("x", 9)
	    .attr("dy", ".35em")
	    .attr("transform", "rotate(45)")
	    .style("text-anchor", "start");

	svgBarChart.append("g")
		.attr("class", "axis")
	    .attr("transform", "translate(" + margin.left + ", 0)")
	    .call(y_axis);
	
	// adding axes labels
	svgBarChart.append("text") 
		.attr("class", "axisText")            
	    .attr("transform", "translate(" + ( width / 2) + " ," + 
	    	(height - margin.bottom + 40) + ")")
	    .style("text-anchor", "middle")
	    .text("Year");

	svgBarChart.append("text")
     	.attr("class", "axisText")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 5)
	    .attr("x", - (height / 2))
	    .attr("dy", "1em")
	    .style("text-anchor", "middle")
	    .text("Amount of exoplanets found");
};