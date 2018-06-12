/** 
* Marc Moorman
* 10769781
* file containing the function to draw a scatter plot
**/

// TODO:
// * keuze over outliers
// * legenda
// * update per jaar na switchen variabele

// put together the planets found per year with names/mass/distance (star and planet itself)
function getScatterData (data, year) {
	
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
function drawScatterplot(data, year, topic) {
	
	console.log(topic)
	console.log(year)

	// characteristics for SVG element
	var width = 500;
	var height = 400;
	var barPadding = 5;
	var leftMargin = 50;
	var bottomMargin = 50;
	var topMargin = 10
	var rightMargin = 35;
	var variableDomain;

	if (topic == "planets") {
		domain = [1.5, 0];
		distance = "angular_distance";
	}
	else {
		domain = [100, 0];
		distance = "star_distance";
	}
	
	// retrieve data from function
	var planetsYear = getScatterData(data, year);
	console.log(planetsYear)

	// scaling for the axis
	var scaleXScatter = d3.scaleLinear()
 		.domain([0, d3.max(planetsYear, function(d){ return +d.mass * 1.10})])
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

	// x axis label
	svgScatterplot.append("text") 
		.attr("class", "axisText")            
    	.attr("transform", "translate(" + (width / 2) + " ," + (height - (barPadding * 2)) + ")")
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

    // creating info window
    var scatterTip = d3.tip()
		.attr("class", "d3-tip")
    	.offset([-20, 0]).html(function(d, i) {
    		return "<strong>Planet:</strong> <span style='color:black'>" + planetsYear[i]["name"] + "</span>" + "</br>" +
    		"<strong>Mass:</strong> <span style='color:black'>" + planetsYear[i]["mass"] + "</span>" + "</br>" +
    		"<strong>Distance:</strong> <span style='color:black'>" + planetsYear[i][distance] + "</span>" });
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
	   		return scaleYScatter(planetsYear[i][distance]);
	   	})
		.attr("r", 5)
		.attr("fill", function(d, i){	
			// colouring to roundness of planet in comparison to earht's eccentricity
			if (planetsYear[i]["eccentricity"] > 0.0167) {return "#c51b8a"}
			else {return "#fa9fb5"}
		})
		.on("mouseover", scatterTip.show)
		.on("mouseout", scatterTip.hide);

	updateScatterAxis(data, year);
};


// update function for the circles in scatter plot
function updateScatters(data, year, topic) {

	// remove old scatter plot and draw new one
	d3.selectAll("#scatterplot").remove();
	drawScatterplot(data, year, topic);
};

// function to swithc between subject put op against each other
function updateScatterAxis(data, year){
	
	// draw new scatter plot to according topic
	document.getElementById("star").onclick = function(){
		d3.selectAll("#scatterplot").remove();
		topic = "star"
		year = 1989
		updateScatters(data, year, topic)
	};

	// draw new scatter plot to according topic
	document.getElementById("planets").onclick = function(){
		d3.selectAll("#scatterplot").remove();
		topic = "planets"
		year = 1989
		updateScatters(data, year, topic)
	};
};