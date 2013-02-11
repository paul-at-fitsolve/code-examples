//Javascript for Unipro's Specsavers system.
//This is where reusable custom Javascript should be declared.
Drupal.Unipro= {};
jQuery.extend(Drupal.Unipro,{
		dumpProps : function(obj, parent) {
		// Debugger function for dumping all the properties of the passed-in object
		for (var i in obj) {
		  // if a parent (2nd parameter) was passed in, then use that to
		  // build the message. Message includes i (the object's property name)
		  // then the object's property value on a new line
		  if (parent) { var msg = parent + "." + i + "\n" + obj[i]; } else { var msg = i + "\n" + obj[i]; }
		  // Display the message. If the user clicks "OK", then continue. If they
		  // click "CANCEL" then quit this level of recursion
		  if (!confirm(msg)) { return; }
		  // If this property (i) is an object, then recursively process the object
		  if (typeof obj[i] == "object") {
			 if (parent) { Drupal.Unipro.dumpProps(obj[i], parent + "." + i); } else { Drupal.Unipro.dumpProps(obj[i], i); }
		  }
		}
	}
});

 jQuery(document).ready(function() {
     // to do - needs more precise selector
     jQuery('.ckeditor_links').hide();
	 jQuery('a.sf-depth-1').attr('href','#');
	 jQuery('a.sf-depth-1[title="Home"]').attr('href','/specsavers');
	 
	 
	 
	 jQuery('label[for="edit-body-und-0-summary"]').after(jQuery('.text-summary-wrapper .description'));
	 jQuery('label[for="edit-title"]').after(jQuery('#title_description'));
	 jQuery('label[for="edit-body-und-0-value"]').after(jQuery('#body_description'));
	 jQuery('#image span.fieldset-legend').after(jQuery('#image_description'));
	 jQuery('#document span.fieldset-legend').after(jQuery('#document_description'));
	 jQuery('#body').after(jQuery('#suggest_tags'));
     jQuery('.tabledrag-toggle-weight').hide();

  });
 



 
