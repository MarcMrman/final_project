/** 
* Marc Moorman
* 10769781
* file containing the function to draw a polar area diagram
**/

// to avoid error when removing svg for the first time in drawAreaDiagram()
var svgAreaDiagram;

// retrieve data for year clicked on
function getAreaDiagramData() {

    var methods = [];

    // filetering out needed data
    for (var i = 0; i < data.data.length; i ++) {
        if (data.data[i]["discovered"] == year) {
            methods.push(data.data[i]["detection_type"]);
        };
    };

    /** * sort list to get methods in order
        * to make counting easier **/
    sortedMethods = methods.sort();

    var methodsUsed = [];
    var findingsPerMethod = []; 
    var count = 0;
    var cursor = null;

    // counting duplicates in array for amount of findings per year
    for (var i = 0; i < sortedMethods.length + 1; i ++) {
        if (sortedMethods[i] != cursor) {
            methodsUsed.push(sortedMethods[i]);
            findingsPerMethod.push(count);
            cursor = sortedMethods[i];
            count = 1;
        }

        else {
            count += 1;
        }
    };

    /** slicing arrays to remove the first count(which is 0) pushed to findingsPerMethod and 
     * the undefined that is pushed to methodsUsed at the end because I count
     * sortedMethods + 1 **/
    return [findingsPerMethod.slice(1,),
             methodsUsed.splice(0, methodsUsed.length - 1)];
};

// function to draw the area polar diagram
function drawAreaPolarDiagram() {

    // adding title to html
    document.getElementById("titleAreaDiagram").innerHTML = "The planets in "
        + year;

    // checking for scatterplot to avoid removal when loading page initially
    if (svgAreaDiagram != undefined) {
        d3.selectAll("#svgAreaDiagram").remove();
    };

	// retrieving needed data for diagram
	var areaDiagramData = getAreaDiagramData();
    var findingsPerMethod = areaDiagramData[0];
	var methodsUsed = areaDiagramData[1];

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

    // append g for chart
    var pieG = g.append("g");

    // append g for legend
    var colorLegendG = g.append("g")
    	.attr("class", "color-legend")
        .attr("transform", "translate(350, -36)");

    // scaling for the g elements
    var radiusScale = d3.scaleSqrt().range([0, radiusMax]);
    var colorScale = d3.scaleOrdinal()
        .range(colorbrewer.YlOrBr[7]);
    
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
    		return "<strong>Method:</strong> <span style='color:black'>" + 
            methodsUsed[i] + "</span>" + "<br>" + "<strong>Found:</strong> \
             <span style='color:black'>" + findingsPerMethod[i] + "</span>" + "<br>"
        });
	svgAreaDiagram.call(polarTip);

    // setting domain for g elements
    radiusScale.domain([0, d3.max(findingsPerMethod)]);
    colorScale.domain(methodsUsed);

    // pie returns 1 to make the angles constant
    var pie = d3.pie().value(function () { 
        return 1; 
    });
    
    // setting radius of slices making it a polar area diagram
   	var arc = d3.arc().outerRadius(function(d) { 
    	return radiusScale(d.data);
    });

    // setting inner radius to make slices go to middle of diagram
    arc.innerRadius(function(d) {
    	return 0;
    });
    
    // position g's for chart elements
	pieG.attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");

    svgAreaDiagram.append("text")
        .attr("class", "titleScatter")
        .attr("x", outerWidth - 240)
        .attr("y", outerHeight - 385)
        .text("Methods of detection");


    // variables for storing planets when hoverd over and drawing correctly
    var method;
    var planetsMethod;

    /** * creating slices for diagram
        * show tool tip when hovered over
        * highlight scatters when hovered over according detection methods **/
    var slices = pieG.selectAll("path")
    	.data(pie(findingsPerMethod))
    	.enter()
    	.append("path")
		.attr("d", arc)
    	.attr("fill", function (d, i) { 
    		return colorScale(methodsUsed[i]); 
    	})
        /** * highlighting planets when mouseenter in area diagram 
            * to make it easier to draw them back correctly the planets 
            * are stored in a list **/
        .on("mouseenter", function(d, i) {
            method = "circle#" + methodsUsed[i];

            planetsMethod = [];
            
            d3.selectAll(method)._groups.forEach(function(i) {
                i.forEach(function(j) {
                    planetsMethod.push(j.__data__);
                })
            })

            d3.select("#scatterplot")
    			.selectAll(method)
    			.style("fill", "#000000")
                .attr("r", 7);
            })
        .on("mouseleave", function(d, i) {
            d3.select("#scatterplot")
                .selectAll(method)
                .attr("r", function(d, i) {
                    if (planetsMethod[i]["radius"] != "") {
                        return planetsMethod[i]["radius"] * 5;
                    }
                    else {
                        return 3;
                    }
                })
                .style("fill", function(d, i) {  
                    if (planetsMethod[i]["eccentricity"] > 0.0167) {
                        return "#08519c";
                    }
                    else {
                        return "#bdd7e7";
                    }
                })
            })
        .on("mouseover", polarTip.show)
		.on("mouseout", polarTip.hide);
    slices.exit().remove();

    colorLegendG.call(colorLegend);
};