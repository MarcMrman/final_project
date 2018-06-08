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
		drawScatterplotAxis(response[0], 1989);
		//drawAreaDiagram(response[0]);
		// getAreaDiagramData(response[0], 2008)
	};
};