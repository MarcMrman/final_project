/** 
* Marc Moorman
* 10769781
* main javascript file for exoplanets project
**/

// function that loads data while loading
window.onload = function() {

	// function to load data
	d3.queue()
	  .defer(d3.json, "data/exoplanets.json")
	  .awaitAll(loadingPage);

	// function that activates functions when page is loaded
	function loadingPage(error, response) {
		if (error) throw error;

		// making data global
		data = response[0];

		drawBarChart();
		drawScatterplot();
		drawAreaPolarDiagram();
	};
};