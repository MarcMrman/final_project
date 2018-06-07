/** 
* Marc Moorman
* 10769781
* file containing the function to draw a scatter plot
**/

// TODO:
// * keuze over outliers
// * max waardes niet hardcoden
// * legenda

// creating global variables
var svgScatterplot;
var scaleXScatter;
var scaleYScatter;

// put together the planets found per year with names/mass/distance (star and planet itself)
function getScatterData (data, year) {
	
	var planets = [];

	for (var i = 0; i < data.data.length; i ++) {
		if (data.data[i]["discovered"] == year) {
			planets.push(data.data[i]);
		};
	};
	return planets;
};

// drawing axis of scatter plot
function drawScatterplotAxis (data, year) {

	// characteristics for SVG element
	var width = 500;
	var height = 400;
	var barPadding = 5;
	var leftMargin = 50;
	var bottomMargin = 50;
	var topMargin = 10
	var rightMargin = 35;

	// finding mininimum and maximum values
	// var maxX = Math.max.apply(Math, mass);
	// var maxY = Math.max.apply(Math, findingsPY);

	// scaling for the axis WAARDES NIET HARDCODEN
	scaleXScatter = d3.scaleLinear()
 		.domain([0, 25])
 		.range([leftMargin, width]);
	scaleYScatter = d3.scaleLinear()
		.domain([1.5, 0])
		.range([topMargin, height - bottomMargin]);

	// axis characteristics
	var x_axis = d3.axisBottom()
		.scale(scaleXScatter)
		.ticks(25);		
	var y_axis = d3.axisLeft()
		//.ticks(5)
		.scale(scaleYScatter);

	// create initial svg element
  	svgScatterplot = d3.select("#containerScatterplot")
	    .append("svg")
	    .attr("width", width)
	    .attr("height", height);

	// drawing axis
	svgScatterplot.append("g")
		.attr("class", "axis")
	    .attr("transform", "translate(0," + (height - bottomMargin) + ")")
		.call(x_axis);
	svgScatterplot.append("g")
		.attr("class", "axis")
	    .attr("transform", "translate(" + leftMargin + ", 0)")
		.call(y_axis);

	// x axis label
	svgScatterplot.append("text") 
		.attr("class", "axisText")            
    	.attr("transform", "translate(" + ( width / 2) + " ," + (height - (barPadding * 2)) + ")")
    	.style("text-anchor", "middle")
    	.text("Mass (in jupiter mass)");

	// y axis label
	svgScatterplot.append("text")
     	.attr("class", "axisText")
	    .attr("transform", "rotate(-90)")
	    .attr("y", 15)
	    .attr("x", - (height / 2))
	    .attr("dy", "1em")
	    .style("text-anchor", "middle")
	    .text("Distance (in AU)");

	drawScatters(data, year);
};

// drawing the circles in the scatter plot
function drawScatters(data, year) {
    
    // retrieve data from function
	var planetsYear = getScatterData(data, year);

    // creating info window
    var scatterTip = d3.tip()
  				.attr("class", "d3-tip")
			    .offset([-20, 0]).html(function(d, i) {
	 	    		return "<strong>Planet:</strong> <span style='color:black'>" + planetsYear[i]["name"] + "</span>" + "</br>" +
	 	    		"<strong>Mass:</strong> <span style='color:black'>" + planetsYear[i]["mass"] + "</span>" + "</br>" +
	 	    		"<strong>Distance:</strong> <span style='color:black'>" + planetsYear[i]["angular_distance"] + "</span>" });
	svgScatterplot.call(scatterTip);

    // creating scatters
    svgScatterplot.selectAll("circle")
	   .data(planetsYear)
	   .enter()
	   .append("circle")
	   .attr("class", "circle")
	   .attr("id", "scatters")
	   .attr("cx", function(d, i){
	   		return scaleXScatter(planetsYear[i]["mass"]);
	   })
		.attr("cy", function(d, i){
	   		return scaleYScatter(planetsYear[i]["angular_distance"]);
	   	})
		.attr("r", function(d, i){
			return (planetsYear[i]["mass"]);
		})
		// .attr("fill", function(d, i){
			
		// 	// GDP / hour worked ratio
		// 	if (variable[i][0] / variable[i][1] > variable[0][0] / variable[0][1]) {return "#c51b8a"}
		// 	else if (variable[i][0] / variable[i][1] < variable[0][0] / variable[0][1]) {return "#fa9fb5"}
		// 	else {return "#000000"}
		// })
		.on("mouseover", scatterTip.show)
		.on("mouseout", scatterTip.hide);
};

// update function for the circles in scatter plot
function updateScatters(data, year) {

	d3.selectAll("#scatters").remove();

	drawScatters(data, year);
};