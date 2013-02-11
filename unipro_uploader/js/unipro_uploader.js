Drupal.uploader = {};
jQuery.extend(Drupal.uploader,{
  upload_button: 'input[name*="field_document"][type="submit"]',
  dialogbox:null,
  fid: new Array(),
  path: null,
  warning:'<h1>Warning - A file with the supplied filename already exists on this Connect site.</h1>' +
  '<p>You can link this content to the existing file or cancel.</p>'  +
  '<fieldset id="filedata">' +
  '<legend>Existing file details:</legend>',
  linkform:'<form>' +
  '<fieldset id="metadata">' +
  '<legend>Add description:</legend>' +
  '<label for="description">Description:</label>' +
  '<input type="text" name="description" id="description" /><br />' +
  '</fieldset>' +
  '</form>',
  formattedTime : function (timestamp) {
    // create a new javascript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    var date = new Date(timestamp*1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = date.getFullYear();
    var month = months[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes(); 
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    var formattedTime = day + '-' + month + '-' + year + ' at ' + hours + ':' + minutes;
    return formattedTime;
  },
  detectChange : function () {
    //Calls the server with a filesystem and filename.
    //Server responds with a JSON object containing all the
    //files that match the given name or an empty object if there 
    //is no match.
    var input = jQuery('input[name^="files[field_document"]');
    var fileName = input.val(); 
    if (fileName == ""){
      return;
    }
    
    //If the browser is IE then we need to edit the file name to remove the
    // c:\\fakepath which is added by the browser 
    //http://jordanhall.co.uk/web-applications-cloud-computing/c-fakepath-in-internet-explorer-8-2804912/
    if (jQuery.browser.msie) {
      fileName = fileName.slice(12);
    }
    var warning = Drupal.uploader.warning;
    var parameters = {
      filesystem : 'private://', //We are calling from attachments - so the context is the private filesystem.
      filename : fileName
    };
    jQuery.getJSON(Drupal.settings.basePath + 'ajax/checkfilename', 
      parameters,
      function (data) {
       
        jQuery.each(data, function(key, val) {
          
          if (key == 'found') {
           
            if (!jQuery.isEmptyObject(val)) {  
          
              jQuery.each(val, function(key1, val1) {
            	  
            	  //store the path to the file.
            	  Drupal.uploader.path = key1;
                
                jQuery.each(val1, function(key2, val2) {
          
                  if(key2 == 'file'){
                    
                    warning += '<table>' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Uploaded on</th>' +
                    '<th>Uploaded by</th>' +
                    '<th>Download</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr>';
              
                    jQuery.each(val2 , function(key3, val3) {
                  
                      if (key3 == 'fid') {
                        Drupal.uploader.fid.push(val3);
                      }
                      if (key3 == 'uploader') {
                        warning += '<td>' + val3 + '</td>';
                      }
                      if (key3 == 'timestamp') {
                   
                        warning += '<td>' + Drupal.uploader.formattedTime(val3) + '</td>';
                     
                      }
                             
                      if (key3 == 'nodes') {
                    	warning += '<td><a href="http://' + document.domain  + '/system/files' + Drupal.uploader.path.substr(9) + '">Download</a></td>';
                        warning += '</tr>' +
                        '</tbody>' +
                        '</table>';
                        
                        warning += '<table>' +
                        '<caption>Existing links (current or previous revisions):</caption>' +
                        '<thead>' +
                        '<tr>' +
                        '<th>Title</th>' +
                        '<th>Created on</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>';
                        
                        jQuery.each(val3 , function(key4 , val4) {
                          warning += '<tr>';
                          //Each node
                          jQuery.each(val4 , function(key5 , val5) {
                            //Every value in the node object              
                            if (key5 == 'title') {
                              warning += '<td>' + 
                              '<a href="http://' + location.host + '/node/' + key4 + '" target="_blank" title="Click to open content in a new tab" >' + val5 + '</a>' +
                              '</td>'; 
                            }
                             
                            if (key5 == 'created') {
                              warning += '<td>' + Drupal.uploader.formattedTime(val5) + '</td>'; 
                            }
                          });
                          warning += '</tr>';
                        });
                        warning += '</tbody>' + 
                      '</table>';
                      }
                    });
                  }   
                });    
              });
              warning += '</fieldset>';
              jQuery('#filecheck_dialog')
              .html(warning)
              .dialog({
                autoOpen: false,
                show : 'slide',
                title: fileName,
                modal:true,
                width:600,
                resizable:false,
                buttons: {
                  'Cancel':function() {
                    if (jQuery.browser.msie) {
                      input.replaceWith(input.clone()); 
                    } else {
                      input.val('');
                    } 
                    jQuery(this).dialog("close");
                  },
                  'Make Link':function() {
                    //Link the new node with the existing file.
                    jQuery(this).append(Drupal.uploader.linkform);
                    jQuery('#filecheck_dialog').dialog('option',
                      "buttons", {
                        "Confirm": function() {
                          var description = jQuery('#description').val();
                          if (description == '') {
                            description = fileName;
                          }
                          jQuery.ajax({
                            url: Drupal.settings.basePath + 'ajax/linkfiletonode',
                            type: 'post',
                            data: 'fid=' + Drupal.uploader.fid + '&desc=' + description,
                            success: function(result){
                              jQuery('#filecheck_dialog').dialog("close");
                              jQuery('#filecheck_dialog').
                              html('<h1>File will be linked to your content on save.</h1>').
                              dialog({
                                autoOpen: false,
                                show : 'slide',
                                title: fileName,
                                modal:true,
                                width:600,
                                resizable:false,
                                buttons: {
                                  'OK':function() {
                                    //Lets add the filenames to the form to help the user.
                                    var element = jQuery('#document');
                                    //If we have not already added the wrapper html then do so.
                                    if (jQuery('#filetable').length == 0) {
                                      
                                      var fieldset = '<fieldset id="documentlinks" class="form-wrapper">' +
                                      '<legend>' +
                                      '<div id="link_description" class="desc"><label>Link to an existing document.</label></div>' +
                                      '</legend><p>These documents will be added to your article when you save it.</p>';
                                      
                                      
                                      var tableheader = '<table id="filetable">' +
                                      '<thead>' +
                                      '<tr>'    +
                                      '<th>'    +
                                      'File Name' +
                                      '</th>'     +
                                      '<th>' +
                                      'Description' +
                                      '</th>' +
                                      '</tr>'     +
                                      '</thead>'  +
                                      '<tbody>' +
                                      '</tbody>' + 
                                      '</table>';  
                                      element.append(fieldset + tableheader);
                                    }
                                    
                                    //Add the filename to the form for reference.
                                    var filetable = jQuery('#filetable > tbody:last');
                                    var tablerow = '<tr>' +
                                    '<td>' + fileName + '</td>' +
                                    '<td>' + description + '</td>' +
                                    '</tr>';
                                    filetable.append(tablerow);
                                    
                                    //Clear the file upload box. 
                                    var input = jQuery('input[name^="files[field_document"]');
                                    if (jQuery.browser.msie) {
                                      input.replaceWith(input.clone()); 
                                    } else {
                                      input.val('');
                                    }        
                                    jQuery(this).dialog("close");
                                  }
                                }
                              });
                              jQuery('#filecheck_dialog').dialog('open');   
                            }
                          });   
                        },
                        'Cancel':function() {
                          //Clear the file upload box. 
                          var input = jQuery('input[name^="files[field_document"]');
                          if (jQuery.browser.msie) {
                            input.replaceWith(input.clone()); 
                          } else {
                            input.val('');
                          }         
                          jQuery(this).dialog("close");
                        }
                      });
                  }
                } 
              });
              jQuery('#filecheck_dialog').dialog('open');     
            } else {
              //jQuery(Drupal.uploader.upload_button).show();
              //jQuery('#triggerbutton').remove();
            } 
          }
        });
      });
  },
  showScan : function(){    
    //jQuery('#triggerbutton').remove();
   // jQuery(Drupal.uploader.upload_button).hide(); 
    var selector = 'input[name^="files[field_document"]';
    var parent = jQuery(selector).parent();
    jQuery(parent).append('<input id="triggerbutton" type="button" class="form-submit ajax-processed" value="Check File" name="trigger_button">');
  }
  
  
});
 
jQuery(document).ready(function() {
  
  //Select the input html element that contains the name of the file to be uploaded.
  var selector = 'input[name^="files[field_document"]';
 
  //Now use the delegate function to bind events to all inputs that exist now AND ARE CREATED IN THE FUTURE - caters for multiple file uploads.
  
  if (jQuery.browser.msie) {
    jQuery(document).delegate(selector,'focus', Drupal.uploader.showScan);
  }
  jQuery(document).delegate(selector, jQuery.browser.msie ? 'blur' : 'change' , Drupal.uploader.detectChange);
  //Hide the upload button so that user cannot trigger an upload as well as an attachment. We will move the button to be inline with the file attachment dialogue.
  //jQuery(Drupal.uploader.upload_button).hide();
  jQuery('body').append('<div id="filecheck_dialog"></div>');
  
});
