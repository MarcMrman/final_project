$('.checkbox :checkbox').change(function () {
    var $cs = $(this).closest('.checkbox').find(':checkbox:checked');
    if ($cs.length > 1) {
        this.checked = false;
    }
});

//function highlightPlanets(checkbox) {
	
// document.getElementById("smaller").onclick = function() {
// 	if (this.checked){
// 		alert("hi");
// 	}	
// }




//}