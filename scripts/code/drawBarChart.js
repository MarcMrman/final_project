/** 
* Marc Moorman
* 10769781
* file containing the function to draw a bar chart
**/

// TODO:
// * 2018 in bar chart zetten ook
// * variable to keep track of last button pressed

// function to gather data fit for the bar chart
function getBarData(data) {

	// collecting years for axis
	var years = [];
	for (var i = 0; i < data.data.length; i ++) {

		var year = data.data[i]["discovered"];
		years.push(year);
	}
	
	sortedYears = years.sort();
	
	// ticks for x axis
	var yearsFound = [null];
	for (var i = 0; i < sortedYears.length; i ++) {
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
	}
	//console.log(sortedYears)
	//console.log(years)
	//console.log(findingsPY)

	return [years, findingsPY, yearsFound.slice(1,23)];
};

// function to draw a bar chart
function drawBarChart(data) {
	
	// variable to keep track of last button pressed
	//var trackButton = "planets";
	//trackButton = getTopic()
	// console.log("topic in bar script", topic)
	// retrieving data from function
	var years = getBarData(data)[0];
	var findingsPY = getBarData(data)[1];
	var yearsFound = getBarData(data)[2];
	// console.log(yearsFound)

	// var x = getTopic();
	// console.log("x in draw bar chart:", x)

	// characteristics for SVG element
	var width = 500;
	var height = 400;
	var barPadding = 5;
	var margin = {left: 50, top: 10, right: 35, bottom: 50};
	var maxRgb = 255;

	// finding mininimum and maximum values
	var minX = Math.min.apply(Math, yearsFound);
	var maxX = Math.max.apply(Math, yearsFound);
	var maxY = Math.max.apply(Math, findingsPY);
	
	// scaling for the axis
	var scaleXBar = d3.scaleLinear()
 		.domain([minX, maxX])
 		.range([margin.left, width]);
	var scaleYBar = d3.scaleLinear()
		.domain([maxY * 1.10, 0])
		.range([margin.top, height - margin.bottom]);

	// axis characteristics
	var x_axis = d3.axisBottom()
		.scale(scaleXBar)
		.ticks(22)
		.tickFormat(d3.format("d"));		
	var y_axis = d3.axisLeft()
		//.ticks(5)
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
    		return "<strong>Year:</strong> <span style='color:black'>" + yearsFound[i] + "</span>" + "<br>" +
			"<strong>Discoveries:</strong> <span style='color:black'>" + findingsPY[i] + "</span>" + "<br>" });
	svgBarChart.call(barTip);

	// append title to graph
	svgBarChart.append("text")
		.attr("class", "title")
	    .attr("y", 15)
	    .attr("x", margin.left + 10)
	    .text("Development of Exoplanet discovery over the years");

	// drawing bars in bar chart
	svgBarChart.selectAll("rect")
	   .data(findingsPY)
	   .enter()
	   .append("rect")
	   .attr("class", "rect")
	   // .attr("id", function(d, i){
	   // 		return s})
	   .attr("x", function(d, i){
	   		return i * ((width - margin.left) / findingsPY.length) + margin.left;
	   })
	   .attr("y", function(d, i){
	   		return height - margin.bottom - (findingsPY[i]  * 2.5);
	   })
	   .attr("width", ((width - margin.left) / findingsPY.length) - barPadding)
	   .attr("height", function(d, i){
	   		return findingsPY[i] * 2.5;
	   })
	   .attr("fill", function(d){
            return "rgb(" + (Math.round(maxRgb - d)) + ", 0, 0)";
        })
	   .on("mouseover", barTip.show)
	   .on("mouseout", barTip.hide)
	   .on("click", function(d, i) {
	   		//console.log("topic in clck:", topic)
			updateAreaDiagram(data, yearsFound[i]);
			if (topic == "planets"){
				//console.log("topic in planet if:", topic)
				updateScatters(data, yearsFound[i], "planets", "all");
			}
			else {				
				//console.log("topic in star if:", topic)
				updateScatters(data, yearsFound[i], "star", "all");
			}
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
	    .attr("transform", "translate(" + ( width / 2) + " ," + (height - margin.bottom + 40) + ")")
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