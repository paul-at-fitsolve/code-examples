//Javascript to enhance the behaviour of the search forms.
jQuery(document).ready(function() {
	
	
	//Always give focus to the search box on every page load.
	//jQuery('#edit-term').focus();
	//Trap lost focus from header textbox and put focus on submit button.
	//Caters for autocomplete.
	jQuery('#edit-term').blur(function() {
		document.getElementById('header_search_submit').focus();
	});
	jQuery('#autocomplete').focus(function() {
		document.getElementById('header_search_submit').focus();
	});
	//Trigger the submit event on the keypress only if there is something in the textbox.
	jQuery(document).keypress(function(e) {
	    if(e.keyCode == 13) {
	    	var search_term = jQuery('#edit-term').val();
	        if (search_term != "") {
	        	jQuery('#header_search_submit').submit();
	        } 
	    }
	});
});