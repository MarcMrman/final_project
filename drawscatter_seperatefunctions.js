// drawing axis of scatter plot
// function drawScatterplotAxis (data, topic, year) {

// 	// characteristics for SVG element
// 	var width = 500;
// 	var height = 400;
// 	var barPadding = 5;
// 	var leftMargin = 50;
// 	var bottomMargin = 50;
// 	var topMargin = 10
// 	var rightMargin = 35;

// 	// finding mininimum and maximum values
// 	// var maxX = Math.max.apply(Math, mass);
// 	// var maxY = Math.max.apply(Math, findingsPY);

// 	// if(topic == "planet") {
// 	// 	domain = [1.5, 0];
// 	// }
// 	// // else {
// 	// // 	domain = [100, 0];
// 	// // }

// 	// scaling for the axis WAARDES NIET HARDCODEN
// 	scaleXScatter = d3.scaleLinear()
//  		.domain([0, 25])
//  		.range([leftMargin, width]);
// 	scaleYScatter = d3.scaleLinear()
// 		.domain([100, 0])
// 		.range([topMargin, height - bottomMargin]);

// 	// axis characteristics
// 	var x_axis = d3.axisBottom()
// 		.scale(scaleXScatter)
// 		.ticks(25);		
// 	var y_axis = d3.axisLeft()
// 		//.ticks(5)
// 		.scale(scaleYScatter);

// 	// create initial svg element
//   	svgScatterplot = d3.select("#containerScatterplot")
// 	    .append("svg")
// 	    .attr("width", width)
// 	    .attr("height", height);

// 	// drawing axis
// 	svgScatterplot.append("g")
// 		.attr("class", "axis")
// 		.attr("id", "x_axis")
// 	    .attr("transform", "translate(0," + (height - bottomMargin) + ")")
// 		.call(x_axis);
// 	svgScatterplot.append("g")
// 		.attr("class", "axis")
// 		.attr("id", "y_axis")
// 	    .attr("transform", "translate(" + leftMargin + ", 0)")
// 		.call(y_axis);

// 	// x axis label
// 	svgScatterplot.append("text") 
// 		.attr("class", "axisText")            
//     	.attr("transform", "translate(" + (width / 2) + " ," + (height - (barPadding * 2)) + ")")
//     	.style("text-anchor", "middle")
//     	.text("Mass (in jupiter mass)");

// 	// y axis label
// 	svgScatterplot.append("text")
//      	.attr("class", "axisText")
// 	    .attr("transform", "rotate(-90)")
// 	    .attr("y", 15)
// 	    .attr("x", - (height / 2))
// 	    .attr("dy", "1em")
// 	    .style("text-anchor", "middle")
// 	    .text("Distance (in AU)");

// 	drawScatters(data, topic, year);
// 	updateScatters(data, topic, year);
// 	updateScatterAxis(data, topic, year);
// };

// drawing the circles in the scatter plot
// function drawScatters(data, topic, year) {
    

//     console.log(topic)
//     // decide info displayed on y axis
//     if(topic == "planet") {
//     	distance = "angular_distance";
//     }
//     else {
//     	distance = "star_distance"
//     }

//     console.log(year)
//     // retrieve data from function
// 	var planetsYear = getScatterData(data, year);

//     // creating info window
//     var scatterTip = d3.tip()
//   				.attr("class", "d3-tip")
// 			    .offset([-20, 0]).html(function(d, i) {
// 	 	    		return "<strong>Planet:</strong> <span style='color:black'>" + planetsYear[i]["name"] + "</span>" + "</br>" +
// 	 	    		"<strong>Mass:</strong> <span style='color:black'>" + planetsYear[i]["mass"] + "</span>" + "</br>" +
// 	 	    		"<strong>Distance:</strong> <span style='color:black'>" + planetsYear[i][distance] + "</span>" });
// 	svgScatterplot.call(scatterTip);

//     // creating scatters
//     svgScatterplot.selectAll("circle")
// 	   .data(planetsYear)
// 	   .enter()
// 	   .append("circle")
// 	   .attr("class", "circle")
// 	   .attr("id", "scatters")
// 	   .attr("cx", function(d, i){
// 	   		return scaleXScatter(planetsYear[i]["mass"]);
// 	   })
// 		.attr("cy", function(d, i){
// 	   		return scaleYScatter(planetsYear[i][distance]);
// 	   	})
// 		.attr("r", function(d, i){
// 			return (planetsYear[i]["eccentricity"] * 10);
// 		})
// 		// .attr("fill", function(d, i){
			
// 		// 	// GDP / hour worked ratio
// 		// 	if (variable[i][0] / variable[i][1] > variable[0][0] / variable[0][1]) {return "#c51b8a"}
// 		// 	else if (variable[i][0] / variable[i][1] < variable[0][0] / variable[0][1]) {return "#fa9fb5"}
// 		// 	else {return "#000000"}
// 		// })
// 		.on("mouseover", scatterTip.show)
// 		.on("mouseout", scatterTip.hide);
// };