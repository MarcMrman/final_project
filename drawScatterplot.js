/** 
* Marc Moorman
* 10769781
* file containing the function to draw a scatter plot
**/

// TODO:
// * keuze over outliers
// * legenda
// * update per jaar na switchen variabele
// * ra en dec (long/lang)
// * BUTTONS IPV CHECKBOX NOG AANPASSEN IN PROPOSAL

var topic;

// put together the planets found per year with names/mass/distance (star and planet itself)
function getScatterData (data, year) {
	
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
function drawScatterplot(data, year, topic, highlight) {
	
	console.log("topic in draw scatterplot:", topic)
	//console.log(year)
	//console.log(highlight)

	// characteristics for SVG element
	var width = 500;
	var height = 400;
	var barPadding = 5;
	var leftMargin = 50;
	var bottomMargin = 50;
	var topMargin = 10
	var rightMargin = 35;
	// var domain;
	// var distance;
	// var title; 

	// retrieve data from function
	var planetsYear = getScatterData(data, year);
	console.log(planetsYear)

	// statements to determine scale y axis
	if (topic == "planets") {
		domain = [d3.max(planetsYear, function(d){ return +d.angular_distance * 1.10 }), 0];
		distance = "angular_distance";
	}
	else {
		domain = [d3.max(planetsYear, function(d){ return +d.star_distance * 1.10 }), 0];
		distance = "star_distance";
	}

	// scaling for the axis
	var scaleXScatter = d3.scaleLinear()
 		.domain([0, d3.max(planetsYear, function(d){ return +d.mass * 1.10 })])
 		.range([leftMargin, width]);
	var scaleYScatter = d3.scaleLinear()
		.domain(domain)
		//.domain([d3.max(planetsYear, function(d){ return +d.distance * 1.10}), 0])
		.range([topMargin, height - bottomMargin]);

	// axis characteristics
	var x_axis = d3.axisBottom()
		.scale(scaleXScatter)
		.ticks(10);		
	var y_axis = d3.axisLeft()
		//.ticks(5)
		.scale(scaleYScatter);

	// create initial svg element
  	var svgScatterplot = d3.select("#containerScatterplot")
	    .append("svg")
	    .attr("id", "scatterplot")
	    .attr("width", width)
	    .attr("height", height);

	// drawing axis
	svgScatterplot.append("g")
		.attr("class", "axis")
		.attr("id", "x_axis")
	    .attr("transform", "translate(0," + (height - bottomMargin) + ")")
		.call(x_axis);
	svgScatterplot.append("g")
		.attr("class", "axis")
		.attr("id", "y_axis")
	    .attr("transform", "translate(" + leftMargin + ", 0)")
		.call(y_axis);

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

	// append title to graph
	svgScatterplot.append("text")
		.attr("class", "title")
	    .attr("y", 10)
	    .attr("x", 5)
	    .text("Distance to " + topic + " against mass of planet");

    // creating info window
    var scatterTip = d3.tip()
		.attr("class", "d3-tip")
    	.offset([-20, 0]).html(function(d, i) {
    		return "<strong>Planet:</strong> <span style='color:black'>" + planetsYear[i]["name"] + "</span>" + "</br>" +
    		"<strong>Mass:</strong> <span style='color:black'>" + planetsYear[i]["mass"] + "</span>" + "</br>" +
    		"<strong>Distance:</strong> <span style='color:black'>" + planetsYear[i][distance] + "</span>" });
	svgScatterplot.call(scatterTip);

    // creating scatters
    var scatters = svgScatterplot.selectAll("circle")
	   	.data(planetsYear)
		.enter()
		.append("circle")
		.attr("class", "circle")
		.attr("id", "scatters")
		.attr("cx", function(d, i){
	   		return scaleXScatter(planetsYear[i]["mass"]);
	   })
		.attr("cy", function(d, i){
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
			// colouring to roundness (eccentricity) of planet in comparison to earht's eccentricity
			if (planetsYear[i]["eccentricity"] > 0.0167) {return "#e6550d"}
			else {return "#636363"}
		})
		.style("stroke", function(d, i) {
			if (highlight == "smaller" && planetsYear[i]["orbital_period"] >= 365) {
				return "#31a354";
			}
			else if (highlight == "greater" && planetsYear[i]["orbital_period"] <= 365){
				return "#31a354";
			}
			else {
				return "#ffffff"
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
				return 0;
			}
		})
		.on("mouseover", scatterTip.show)
		.on("mouseout", scatterTip.hide);
	
	// scatters.transition()
	// 	.duration(5000)

	// put neccesary information to update function
	//addLegend(svgScatterplot, width, height);
	updateScatterAxis(data, year, topic, highlight);
	highlightPlanets(data, year, topic);
};


// update function for the circles in scatter plot
function updateScatters(data, year, topic, highlight) {

	// remove old scatter plot and draw new one
	d3.selectAll("#scatterplot").remove();
	drawScatterplot(data, year, topic, highlight);
};

// function to swithc between subject put op against each other
function updateScatterAxis(data, year, topic, highlight){


	// draw new scatter plot to according topic
	document.getElementById("star").onclick = function(){
		d3.selectAll("#scatterplot").remove();
		topic = "star";
		console.log("drawSaccter: topic in click by id stars:", topic)
		year = 1989;
		updateScatters(data, year, topic, "all");
	};

	// draw new scatter plot to according topic
	document.getElementById("planets").onclick = function(){
		d3.selectAll("#scatterplot").remove();
		topic = "planets";
		console.log("drawSaccter: topic in click by id planets:", topic)
		year = 1989;
		updateScatters(data, year, topic, "all");
	};
};

// highlight planets according to button clicked
function highlightPlanets(data, year, topic) {

	document.getElementById("smaller").onclick = function() {	
		d3.selectAll("#scatterplot").remove();
		drawScatterplot(data, year, topic, "smaller");
	};

	document.getElementById("greater").onclick = function() {	
		d3.selectAll("#scatterplot").remove();
		drawScatterplot(data, year, topic, "greater");
	};

	document.getElementById("all").onclick = function() {	
		d3.selectAll("#scatterplot").remove();
		drawScatterplot(data, year, topic, "all");
	};

};

// function addLegend(svgScatterplot){
	
// 	// creating svg for legend
// 	var widthLegend = 200;
// 	var heightLegend = 100;

// 	var legend = d3.select("#containerScatterplot")
// 		.append("svg")
// 		.attr("id", "legend")
// 		.attr("width", widthLegend)
// 		.attr("height", heightLegend);
// 	//svgScatterplot.selectAll("legend")

// 	// drawing rectangles for legend
// 	var two = [1, 2];

// 	legend.selectAll("rect")
// 	  .data(two)
// 	  .enter()
// 	  .append("rect")
// 	  .attr("class", "legend")
//       .attr("y", function(d, i) {
//       	return 10 + (i*30)
//       }) //height / 2)
//       .attr("x", 50)
//       // function(d, i){
//       // 	return width - 20;
//       // }
//       .attr("width", 20)
//       .attr("height", 20)
//       .style("fill", "red");

//     // adding text to the legend
// 	legend.append("text")
// 		.attr("x", 50)
// 	    .attr("y", function(d, i){
// 	    	return 10 + (i*30)
// 	    })
// 	    .attr("dy", ".35em")
// 	    .style("text-anchor", "end")
// 	    .text("eccentricity below earth");

// 	legend.append("text")
// 		.attr("x", width - 140)
// 	    .attr("y", (height / 2) + 10)
// 	    .attr("dy", ".35em")
// 	    .style("text-anchor", "end")
// 	    .text("eccentricity above earth");
// };

function getTopic(){
	console.log("topic in getTopic:", topic)
	return topic
}