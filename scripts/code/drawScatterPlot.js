/** 
* Marc Moorman
* 10769781
* file containing the function to draw a scatter plot
**/

// * ra en dec (long/lang)

var data;
var topic = "planets";
var year = 1989;
var highlight = "all";
var planetsYear;
var svgScatterplot;

// put together the planets found per year with names/mass/distance
function getScatterData () {
	
	// empty list to store relevant data in
	var planets = [];

	// retrieving all releent data for specific year
	for (var i = 0; i < data.data.length; i ++) {
		if (data.data[i]["discovered"] == year) {
			planets.push(data.data[i]);
		};
	};

	return planets;
};

// function that draws scatter plot
function drawScatterplot() {
	
	// checking if there is a scatterplot to be removed to avoid removal at loading of page
	if (svgScatterplot != undefined) {
		svgScatterplot.remove();
	};

	// characteristics for SVG element
	var width = 500;
	var height = 450;
	var margin = {left: 50, top: 10, right: 35, bottom: 50};
	var barPadding = 5;

	// retrieve data from function
	planetsYear = getScatterData();
	//console.log(planetsYear)

	// statements to determine scale y axis
	if (topic == "planets") {
		domain = [d3.max(planetsYear, function(d){ return +d.angular_distance * 1.10 }), 1e-6];
		distance = "angular_distance";
	}
	else {
		domain = [d3.max(planetsYear, function(d){ return +d.star_distance * 1.10 }), 1e-6];
		distance = "star_distance";
	}

	// scaling for the axis
	var scaleXScatter = d3.scaleLog()
 		.domain([0.001, d3.max(planetsYear, function(d){ return +d.mass * 1.10 })])
 		.range([margin.left, width]);
	var scaleYScatter = d3.scaleLog()
		.domain(domain)
		.range([margin.top, height - margin.bottom]);

	// axis characteristics
	var x_axis = d3.axisBottom()
		.scale(scaleXScatter)
		.ticks(5);		
	var y_axis = d3.axisLeft()
		.ticks(5)
		.scale(scaleYScatter);

	// create initial svg element
  	svgScatterplot = d3.select("#containerScatterplot")
	    .append("svg")
	    .attr("id", "scatterplot")
	    .attr("width", width)
	    .attr("height", height);

	// drawing axis
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

	svgScatterplot.append("text")
		.attr("class", "titleScatter")
		.attr("x", width - 440)
		.attr("y", height - 430)
		.text("Distance to " + topic);

	// axis labels
	svgScatterplot.append("text") 
		.attr("class", "axisText")            
    	.attr("transform", "translate(" + (width / 2) + " ," + (height - (barPadding * 2)) + ")")
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
    		return "<strong>Planet:</strong> <span style='color:black'>" + planetsYear[i]["name"] + "</span>" + "<br>" +
    		"<strong>Mass:</strong> <span style='color:black'>" + planetsYear[i]["mass"] + "</span>" + "<br>" +
    		"<strong>Distance:</strong> <span style='color:black'>" + planetsYear[i][distance] + "</span>" + "<br>" + 
    		"<strong>Method:</strong> <span style='color:black'>" + planetsYear[i]["detection_type"] + "</span>"});
	svgScatterplot.call(scatterTip);

    // creating scatters
    var scatters = svgScatterplot.selectAll("circle")
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
		.attr("r", function(d, i){
			if (planetsYear[i]["radius"] != "") {
				return planetsYear[i]["radius"] * 5;
			}
			else {
				return 3;
			}
		})
		.style("fill", function(d, i){	
			if (planetsYear[i]["eccentricity"] > 0.0167) {return "#e6550d"}
			else {return "#636363"}
		})
		.style("opacity", 0.8)
		.style("stroke", function(d, i) {
			if (highlight == "smaller" && planetsYear[i]["orbital_period"] >= 365) {
				return "#31a354";
			}
			else if (highlight == "greater" && planetsYear[i]["orbital_period"] <= 365){
				return "#31a354";
			}
			else {
				return "#000000"
			}
		})
		.style("stroke-width", function(d, i){
			if (highlight == "smaller" && planetsYear[i]["orbital_period"] >= 365) {
				return 2;
			}
			else if (highlight == "greater" && planetsYear[i]["orbital_period"] <= 365){
				return 2;
			}
			else {
				return 1;
			}
		})
		.on("mouseover", scatterTip.show)
		.on("mouseout", scatterTip.hide);

	// put neccesary information to update function
	addLegend(svgScatterplot);
};


// update function for the circles in scatter plot
function updateScatters() {
	drawScatterplot();
};

// update functions for y axis
function planetAxis() {
	console.log("Planet click");
	topic = "planets";
	drawScatterplot();
};
function starAxis() {
	console.log("starClick");
	topic = "stars";
	drawScatterplot();
};

// functions for highlighting planets by checking radio buttons
function smallerClick() {
	console.log("smakker lcick")
	highlight = "smaller";
	drawScatterplot();
};
function greaterClick() {
	console.log("greater lcick")
	highlight = "greater";
	drawScatterplot();
};
function allClick() {
	console.log("all lcick")
	highlight = "all";
	drawScatterplot();
};

// function to add a legend
function addLegend(svgScatterplot){
	
	d3.selectAll("#legend").remove();

	// creating svg for legend
	var widthLegend = 300;
	var heightLegend = 100;

	var legend = d3.select("#containerScatterplot")
		.append("svg")
		.attr("id", "legend")
		.attr("width", widthLegend)
		.attr("height", heightLegend);
	//svgScatterplot.selectAll("legend")

	// drawing rectangles for legend
	var two = [1, 2];

	legend.selectAll("rect")
	  .data(two)
	  .enter()
	  .append("rect")
	  .attr("class", "legend")
      .attr("y", function(d, i) {
      	return 10 + (i*30)
      }) //height / 2)
      .attr("x", widthLegend - widthLegend + 10)
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", function (d, i) {
      	if (10 + (i * 30) == 10){
      		return "#636363";
      	}
      	else {
      		return "#e6550d";
      	}
      });

    // adding text to the legend
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