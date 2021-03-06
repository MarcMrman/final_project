/** 
* Marc Moorman
* 10769781
* file containing the function to draw a scatter plot
**/

// initializing global variables for updating graphs
var data;

// to avoid error when removing svg for the first time in drawScatterplot()
var svgScatterplot;

// variable to keep track of topic displayed on y-axis
var topic = "planets";

// variable to keep track of year clicked on in bar chart
var year = 1989;

/** * variable to keep track of radio button checked to 
	* highlight corresponding planets **/
var highlight = "all";


function getScatterData () {
// function that gathers data for year clicked on
	
	var planets = [];

	// retrieving all relevant data for specific year
	for (var i = 0; i < data.data.length; i ++) {
		if (data.data[i]["discovered"] == year) {
			planets.push(data.data[i]);
		};
	};

	return planets;
};

function drawScatterplot() {
// function that draws scatter plot on a SVG
	
	// adding title to scatter plot
    document.getElementById("titleScatterplot").innerHTML = "Distance to " + 
    topic + " from earth";

	// checking for scatterplot to remove to avoid removal when loading page initially
	if (svgScatterplot != undefined) {
		svgScatterplot.remove();
	};

	// characteristics for SVG element
	var width = 500;
	var height = 450;
	var margin = {left: 50, top: 10, right: 35, bottom: 50};
	var barPadding = 5;

	var planetsYear = getScatterData();

	/** * statements to determine y-axis characteristics
		* accroding to dropdown menu button click
		* min domain is 1e -6 because of the log scale
		* there is no log(0) **/
	if (topic == "planets") {
		domain = [d3.max(planetsYear, function(d) { 
			return +d.angular_distance}), 1e-6];
		distance = "angular_distance";
	}
	else {
		domain = [d3.max(planetsYear, function(d) { 
			return +d.star_distance}), 1e-6];
		distance = "star_distance";
	}

	// scaling for the axes
	var scaleXScatter = d3.scaleLog()
 		.domain([d3.min(planetsYear, function(d) { 
 			return +d.mass}), d3.max(planetsYear, function(d) { 
 			return +d.mass})])
 		.nice()
 		.range([margin.left, width]);

	var scaleYScatter = d3.scaleLog()
		.domain(domain)
		.nice()
		.range([margin.top, height - margin.bottom]);

	// axes characteristics
	var x_axis = d3.axisBottom()
		.scale(scaleXScatter)
		.ticks(5);		

	var y_axis = d3.axisLeft()
		.ticks(5)
		.scale(scaleYScatter);

	// create svg element
  	svgScatterplot = d3.select("#containerScatterplot")
	    .append("svg")
	    .attr("id", "scatterplot")
	    .attr("width", width)
	    .attr("height", height);

	// drawing axes
	svgScatterplot.append("g")
		.attr("class", "axis")
		.attr("id", "x_axis")
	    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
		.call(x_axis);

	svgScatterplot.append("g")
		.attr("class", "axis")
		.attr("id", "y_axis")
	    .attr("transform", "translate(" + margin.left + ", 0)")
		.call(y_axis);

	// axes labels
	svgScatterplot.append("text") 
		.attr("class", "axisText")            
    	.attr("transform", "translate(" + (width / 2) + " ," +
    		(height - (barPadding * 2)) + ")")
    	.style("text-anchor", "middle")
    	.text("Mass (in jupiter mass)");

	svgScatterplot.append("text")
     	.attr("class", "axisText")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 0)
	    .attr("x", - (height / 2))
	    .attr("dy", "1em")
	    .style("text-anchor", "middle")
	    .text("Distance (in AU)");

    // creating info window
    var scatterTip = d3.tip()
		.attr("class", "d3-tip")
    	.offset([-20, 0]).html(function(d, i) {
    		return "<strong>Planet:</strong> <span style='color:black'>" + 
    		planetsYear[i]["name"] + "</span>" + "<br>" +
    		"<strong>Mass:</strong> <span style='color:black'>" + 
    		planetsYear[i]["mass"] + "</span>" + "<br>" +
    		"<strong>Distance:</strong> <span style='color:black'>" + 
    		planetsYear[i][distance] + "</span>" + "<br>" + 
    		"<strong>Method:</strong> <span style='color:black'>" + 
    		planetsYear[i]["detection_type"] + "</span>"
    	});
	svgScatterplot.call(scatterTip);

	/** * creating scatters
		* show tool tip when hovered over
		* fill scatters according to eccentricity **/
    svgScatterplot.selectAll("circle")
	   	.data(planetsYear)
		.enter()
		.append("circle")
		.attr("class", "circle")
		.attr("id", function(d, i) {
			return planetsYear[i]["detection_type"];
		})
		.attr("cx", function(d, i) {
	   		return scaleXScatter(planetsYear[i]["mass"]);
		})
		.attr("cy", function(d, i) {
	   		return scaleYScatter(planetsYear[i][distance]);
	   	})
	   	// size scatters to radius if data is available
		.attr("r", function(d, i) {
			if (planetsYear[i]["radius"] != "") {
				return planetsYear[i]["radius"] * 5;
			}
			else {
				return 3;
			}
		})
		.style("fill", function(d, i) {	
			if (planetsYear[i]["eccentricity"] > 0.0167) {
				return "#08519c";
			}
			else {
				return "#bdd7e7";
			}
		})
		.style("opacity", 0.8)
		/** * if radio button is checked, read highlight variable 
			* and colour and stroke the corresponding planets accordingly **/
		.style("stroke", function(d, i) {
			if (highlight == "smaller" && +
				planetsYear[i]["orbital_period"] >= 365) {
				return "#99000d";
			}
			else if (highlight == "greater" && +
				planetsYear[i]["orbital_period"] <= 365) {
				return "#99000d";
			}
			else {
				return "#000000"
			}
		})
		.style("stroke-width", function(d, i){
			if (highlight == "smaller" && planetsYear[i]["orbital_period"] >= 365) {
				return 4;
			}
			else if (highlight == "greater" && planetsYear[i]["orbital_period"] <= 365) {
				return 4;
			}
			else {
				return 1;
			}
		})
		.on("mouseover", scatterTip.show)
		.on("mouseout", scatterTip.hide);

	addLegend();
};

function addLegend() {
// draws a legend by appending rectangles to SVG
	
	d3.selectAll("#legend").remove();

	// creating svg for legend
	var widthLegend = 300;
	var heightLegend = 100;
	var legend = d3.select("#containerScatterplot")
		.append("svg")
		.attr("id", "legend")
		.attr("width", widthLegend)
		.attr("height", heightLegend);

	// drawing rectangles for legend
	var rectangles = [1, 2];

	legend.selectAll("rect")
	  .data(rectangles)
	  .enter()
	  .append("rect")
	  .attr("class", "legend")
      .attr("y", function(d, i) {
      	return 10 + (i*30);
      })
      .attr("x", widthLegend - widthLegend + 10)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", function (d, i) {
      	if (10 + (i * 30) == 10) {
      		return "#bdd7e7";
      	}
      	else {
      		return "#08519c";
      	}
      });

    // adding texts to the legend
	legend.append("text")
		.attr("x", widthLegend - 60)
	    .attr("y", heightLegend - 80)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text("eccentricity lower than earth");

	legend.append("text")
		.attr("x", widthLegend - 53)
	    .attr("y", heightLegend - 50)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text("eccentricity higher than earth");
};

function planetAxis() {
// function that updates y-axis by using dropdown menu

	topic = "planets";
	drawScatterplot();
};

function starAxis() {
// function that updates y-axis by using dropdown menu

	topic = "stars";
	drawScatterplot();
};

function smallerClick() {
// function for highlighting planets by checking radio buttons

	highlight = "smaller";
	drawScatterplot();
};

function greaterClick() {
// function for highlighting planets by checking radio buttons

	highlight = "greater";
	drawScatterplot();
};

function allClick() {
// function for highlighting planets by checking radio buttons

	highlight = "all";
	drawScatterplot();
};