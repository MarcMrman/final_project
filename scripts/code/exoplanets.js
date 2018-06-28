/** 
* Marc Moorman
* 10769781
* main javascript file for exoplanets project
**/

window.onload = function() {
// function that loads data while loading page

	// function to load data
	d3.queue()
	  .defer(d3.json, "data/exoplanets.json")
	  .awaitAll(loadingPage);

	function loadingPage(error, response) {
	// function that activates functions when page is loaded

		if (error) throw error;

		// making data global
		data = response[0];

		drawBarChart();
		drawScatterplot();
		drawAreaPolarDiagram();
	};
};