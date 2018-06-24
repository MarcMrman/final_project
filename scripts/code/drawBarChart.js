/** 
* Marc Moorman
* 10769781
* file containing the function to draw a bar chart
**/

// function to gather data fit for the bar chart
function getBarData() {

	// collecting years for axis
	var years = [];
	for (var i = 0; i < data.data.length; i ++) {

		var year = data.data[i]["discovered"];
		years.push(year);
	};
	
	/** * sort list to get methods in order
		* to make counting easier **/
	sortedYears = years.sort();
	
	// ticks for x axis
	var yearsFound = [null];
	for (var i = 0; i < sortedYears.length - 1; i ++) {
		if (years[i] != years[i + 1]) {
			yearsFound.push(years[i]);
		};
	};

	// looking for amount of findings per year
	var findingsPY = [];	
	var count = 0;
	var cursor = null;
	for (var i = 0; i < sortedYears.length; i ++) {

		if (years[i] != cursor) {
			findingsPY.push(count);
			cursor = sortedYears[i];
			count = 1;
		}
		else {
			count += 1;
		}
	};

	/** * lists are sliced to get rid of the null value put into yearsfound
	 	* null is put there to have a starting point for the iterate over
		* otherwise the years would not add up to there corresponding findings
		* in a year 
		**/
	return [findingsPY.slice(1, 20), yearsFound.slice(1, 20)];
};

// function to draw a bar chart
function drawBarChart() {
	
	// adding title to bar chart
    document.getElementById("titleBarChart").innerHTML = "The development of" +
    " exoplanet discovery over the years";

	// retrieving data from function
	var barData = getBarData();
	var findingsPY = barData[0];
	var yearsFound = barData[1];

	// characteristics for SVG element
	var width = 800;
	var height = 500;
	var barPadding = 5;
	var margin = {left: 50, top: 10, right: 35, bottom: 50};
	var maxRgb = 255;

 	var scaleXBar = d3.scaleBand()
 		.rangeRound([margin.left, width])
 		.padding(0.1)
 		.domain(yearsFound);

	var scaleYBar = d3.scaleLinear()
		.domain([d3.max(findingsPY), 0])
		.nice()
		.range([margin.top, height - margin.bottom]);

	// axis characteristics
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
	
	// creating info window for hovering
	var barTip = d3.tip()
		.attr("class", "d3-tip")
	    .offset([-20, 0]).html(function(d, i) {
    		return "<strong>Year:</strong> <span style='color:black'>" + 
    		yearsFound[i] + "</span>" + "<br>" +
			"<strong>Discoveries:</strong> <span style='color:black'>" + 
			findingsPY[i] + "</span>" + "<br>" 
		});
	svgBarChart.call(barTip);

	// creating bars in bar chart
	var bars = svgBarChart.selectAll("rect")
	   .data(findingsPY)
	   .enter()
	   .append("rect");

	/** * making bars fly in with transition
	 	* when clicked on update area diagram and scatter plot
		* show tool tip when hovered over
		* scroll down automatically when clicked on 
		**/
	bars.transition()
		.duration(1000)
	   	.attr("class", "rect")
	   	.attr("x", function(d, i){
	   		return scaleXBar(yearsFound[i]);
		})
		.attr("y", function(d, i){
	   		return scaleYBar(findingsPY[i]);
	    })
		.attr("width", scaleXBar.bandwidth())
		.attr("height", function(d, i){
	   		return height - scaleYBar(findingsPY[i]) - margin.bottom;
	    })
	    .attr("fill", function(d){
            return "rgb(" + (Math.round(maxRgb - d)) + ", 0, 0)";
        });
	    
	bars.on("mouseover", barTip.show)
	    .on("mouseout", barTip.hide)
	    .on("click", function(d, i) {
			// updating the displayed year in scatter plot and area diagram
			year = yearsFound[i];
			drawAreaPolarDiagram();
			drawScatterplot();
			$("html, body").animate({
		        scrollTop: $("#containerScatterplot").offset().top}, "slow");
		});

	// drawing axis
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
	
	// axis labels
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