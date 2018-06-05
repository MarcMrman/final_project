/** 
* Marc Moorman
* 10769781
**/

// function that is triggered when page is loaded
window.onload = function() {

	// data is loaded in as JSON
	d3.queue()
	  .defer(d3.json, "data/exoplanets.json")
	  .awaitAll(loadingPage);
	
	// function to load page after queuing
	function loadingPage(error, response) {
		if (error) throw error;
		
		console.log(response[0])
	};
};