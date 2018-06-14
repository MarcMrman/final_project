/** 
* Marc Moorman
* 10769781
**/

// function that is triggered when page is loaded
window.onload = function() {
	
	// function to load data
	d3.queue()
	  .defer(d3.json, "data/exoplanets.json")
	  .awaitAll(loadingPage);

	// function that loads page
	function loadingPage(error, response) {
		if (error) throw error;

		drawBarChart(response[0]);
		drawScatterplot(response[0], 1989, "planets", "all");
		drawAreaPolarDiagram(response[0], 1989);
	};
};