$(function(){
    // Maintain original value of dataEntryFormValuesChanged. Since we're just triggering piping here, no data is changed, but the jquery triggers will set dataEntryFormValuesChanged = true.
    var thisDataEntryFormValuesChanged = dataEntryFormValuesChanged;
    // If any fields are using @DEFAULT, @NOW, or @TODAY action tag, make sure piping of default value is performed on page load
    $('#questiontable tr.\\@DEFAULT, #questiontable tr.\\@NOW, #questiontable tr.\\@TODAY, #questiontable tr.\\@NOW-SERVER, #questiontable tr.\\@TODAY-SERVER, #questiontable tr.\\@NOW-UTC, #questiontable tr.\\@TODAY-UTC').each(function(i, row) {
        var fname = $(row).attr('sq_id');
        var field = $(row).find('[name="'+fname+'"]');
        if (field.val() != '') { // Only do anything if the field has a value
            // Trigger piping on page
            if ($(field).is('select')) {
                field.trigger('change');
            } else if ($('input[name="'+fname+'___radio"]').length) {
                $('input[name="'+fname+'___radio"][value="'+field.val()+'"]').trigger('click');
            } else {
                // Set @DEFAULT field to show that it changed value
                if ($('#'+fname+'-tr').hasClass('@DEFAULT') && $(this).attr('ignoreDefault') != '1') {
                    $('input[name="'+fname+'"][type="text"]').addClass('calcChanged');
                }
                // For all other fields, simply propagate the value manually to minimize branching/calculation triggering on page load
                $('.piping_receiver.piperec-'+event_id+'-'+fname+'-label').html(field.val());
            }
        }
    });
    // Now set dataEntryFormValuesChanged back to its original value
    dataEntryFormValuesChanged = thisDataEntryFormValuesChanged;
    // Field embedding
    if (page != 'Design/online_designer.php') {
        doFieldEmbedding();
        // Now initialize auto-complete drop-downs since they were delayed for Field Embedding
        enableDropdownAutocomplete();
        // Init secondary unique identifier check
        if (typeof secondary_pk != 'undefined' && secondary_pk != '' && $('#form :input[name="'+secondary_pk+'"]').length) {
            // Create onblur event to make an ajax call to check uniqueness
            // Add extra inline onblur attribute for fastest reaction time to prevent submitting form
            var onblur = ($('#form :input[name="'+secondary_pk+'"]').attr('onblur') == null) ? '' : ($('#form :input[name="'+secondary_pk+'"]').attr('onblur')+';');
            $('#form :input[name="'+secondary_pk+'"]').attr('onblur', onblur+'checkSecondaryUniqueField($(this));');
        }
    }
    // Floating matrix headers
    enabledFloatingMatrixHeaders();
});
$(window).on('resize', function () {
    enabledFloatingMatrixHeaders();
});

// Is element visible in the browser viewport?
!function(t){var i=t(window);t.fn.visible=function(t,e,o){if(!(this.length<1)){var r=this.length>1?this.eq(0):this,n=r.get(0),f=i.width(),h=i.height(),o=o?o:"both",l=e===!0?n.offsetWidth*n.offsetHeight:!0;if("function"==typeof n.getBoundingClientRect){var g=n.getBoundingClientRect(),u=g.top>=0&&g.top<h,s=g.bottom>0&&g.bottom<=h,c=g.left>=0&&g.left<f,a=g.right>0&&g.right<=f,v=t?u||s:u&&s,b=t?c||a:c&&a;if("both"===o)return l&&v&&b;if("vertical"===o)return l&&v;if("horizontal"===o)return l&&b}else{var d=i.scrollTop(),p=d+h,w=i.scrollLeft(),m=w+f,y=r.offset(),z=y.top,B=z+r.height(),C=y.left,R=C+r.width(),j=t===!0?B:z,q=t===!0?z:B,H=t===!0?R:C,L=t===!0?C:R;if("both"===o)return!!l&&p>=q&&j>=d&&m>=L&&H>=w;if("vertical"===o)return!!l&&p>=q&&j>=d;if("horizontal"===o)return!!l&&m>=L&&H>=w}}}}(jQuery);

// Embed fields
function doFieldEmbedding()
{
    // Is survey page?
    var isSurveyPage = (page == 'surveys/index.php');
    var embeddedFields = new Array();
    var i = 0;
    // Do not perform field embedding on the eConsent certification page (not necessary and actually causes issues with required fields).
    // Prevent this simply by removing the rc-field-embed class, but finish out this function since it is necessary for the whole flow.
    if ($('#econsent_confirm_checkbox_div').length) {
        $('.rc-field-embed').removeClass('rc-field-embed');
    }
    // Deal with survey enhanced choices: Due to labels being duplicated here, remove the embedded field in the original label.
    if (isSurveyPage) {
        $('#questiontable .enhancedchoice .rc-field-embed').each(function(){
            $('#questiontable .rc-field-embed[var="'+$(this).attr('var')+'"]:first').remove();
        });
    }
    // Loop through HTML content and substitute in native page content
    $('#questiontable .rc-field-embed').each(function ()
    {
        var this_field = $(this).attr('var'); // field_name
        // Find the 'real tr' for the field to be relocated
        var source_tr = $("tr[sq_id='" + this_field + "']");
        // Make sure field is not the record ID field. If so, give a warning.
        if (this_field == table_pk) {
            $(this).attr('error','1').html('<span class="text-danger fs11"><i class="fas fa-exclamation-triangle"></i> '+lang.design_799+' '+lang.design_823+'</span>');
            return;
        }
        // Make sure field is not from another instrument. If so, give a warning.
        if (source_tr.length === 0 || $(this).hasClass('embed-other-form')) {
            $(this).attr('error','1').html('<span class="text-danger fs11"><i class="fas fa-exclamation-triangle"></i> '+lang.design_799+' "'+this_field+'" '+lang.design_821+'</span>');
            return;
        }
        // Make sure we don't embed a field more than once. Give a warning.
        if (in_array(this_field, embeddedFields)) {
            $(this).attr('error','1').html('<span class="text-danger fs11"><i class="fas fa-exclamation-triangle"></i> '+lang.design_799+' "'+this_field+'" '+lang.design_800+'</span>');
            return;
        }
        // Make sure the field isn't embedded in itself
        if ($("tr[sq_id='" + this_field + "'] .rc-field-embed[var='" + this_field + "']").length) {
            $(this).attr('error','1').html('<span class="text-danger fs11"><i class="fas fa-exclamation-triangle"></i> '+lang.design_799+' "'+this_field+'" '+lang.design_833+'</span>');
            return;
        }
        // Do not embed a field in the Context Msg at the top of a form
        if ($("td.context_msg .rc-field-embed[var='" + this_field + "']").length && $(this).parentsUntil('td.context_msg').length) {
            $(this).removeClass('rc-field-embed');
            return;
        }
        // Move the field
        embeddedFields[i++] = this_field;
        var displayIcons = $(this).hasClass('embed-show-icons');
        var align = (source_tr.children('td').length === (isSurveyPage ? 2 : 1)) ? "left": "right";
        var source_data;
        if (source_tr.attr('mtxgrp')) {
            // Matrix field
            var header_table = $('#' + source_tr.attr('mtxgrp') + '-mtxhdr-tr').find('table:first').clone();
            header_table.find('td:first').remove();
            var data_table = source_tr.find('table:first').clone();
            data_table.find('td:first').remove();
            source_data = $("<div>").append(header_table).append(data_table);
        } else if (align === "right") {
            // Vanilla- take the td.data
            source_data =  $("td.data", source_tr).children();
        } else if ($('a.fileuploadlink', source_tr).length > 0) {
            // This is a file upload field which needs an exception
            source_data = source_tr.find("td").not('questionnum').find('label').nextAll();
        } else {
            // This rule handles the majority of left-aligned fields
            // Take everything after the div.space separator
            source_data = source_tr.find("td").not('questionnum').find("div.space").nextAll();
        }
        // If we still didn't find anything - then lets log an error and continue
        if (!source_data.length) {
            return true;
        }
        // Adjust width of some non-hidden inputs
        $("input[type!='hidden']", source_data.parent()).each(function (i, e) {
            var type = $(e).prop('type');
            // Left aligned stuff has a rci-left class... going to leave it for now.
            if ($(e).hasClass("rci-left")) $(e).removeClass('rci-left');
            if (type == 'text' && !$(this).hasClass('hasDatepicker') && !$(this).hasClass('hiddenradio')) $(this).css({'max-width': '380px'});
            if (type === 'textarea' || (type == 'text' && !$(this).hasClass('hasDatepicker') && !$(this).hasClass('hiddenradio'))) $(this).css('width', '95%');
        });
        // Add Data History & Field Comment Log/Data Resolution Workflow icons -- doesn't work for matrix!
        if (isSurveyPage === false && displayIcons === true) {
            // Place the icons into a span tag so you can do CSS to control their wrapping
            var trp;
            if (source_tr.attr('mtxgrp')) {
                trp = $('table[role="presentation"]:last', source_tr);
            } else if (source_tr.hasClass('sliderlabels')) {
                // Do nothing?
            } else {
                // This new version only supports the presentation table wrapper!
                trp = $('table[role="presentation"]:first', source_tr);
            }
            if (trp.length) {
                // Replace the first TD with the data
                trp.find('td:first').html(source_data);
                $(this).html(trp);
            }
        } else {
            // Move Contents of source
            $(this).html(source_data);
        }
    });
    // If a field is embedded inside another embedded field, then display an error
    $('#questiontable tr.row-field-embedded .rc-field-embed').each(function(){
        // Re-display the original field
        var tr = $(this).parentsUntil('tr.row-field-embedded').parent();
        var tr_id = tr.attr('sq_id');
        tr.removeClass('hide');
        // If this embedded already has an error, don't go further here
        if ($(this).attr('error') == '1') return;
        // Add warning note
        var this_field = $(this).attr('var');
        $(this).after('<div class="text-danger fs11"><i class="fas fa-exclamation-triangle"></i> '+lang.design_799+' "'+tr_id+'" '+lang.design_801+' {'+this_field+'} '+lang.design_802+' {'+this_field+'} '+lang.design_803+'</div>');
    });
    // Display the form/survey
    displayQuestionTable();
    // Open Save button tooltip	fixed at top-right of data entry forms (re-run this now that the table has been displayed)
    if (i > 0 && page == 'DataEntry/index.php') displayFormSaveBtnTooltip();
}

function displayQuestionTable()
{
    if (elementExists(document.getElementById('formtop-div'))) document.getElementById('formtop-div').style.display='none';
    if (elementExists(document.getElementById('questiontable_loading'))) document.getElementById('questiontable_loading').style.display='none';
    if (elementExists(document.getElementById('questiontable'))) document.getElementById('questiontable').style.display='table';
    if (elementExists(document.getElementById('form_response_header'))) document.getElementById('form_response_header').style.display='block';
    if (elementExists(document.getElementById('formtop-div'))) document.getElementById('formtop-div').style.display='block';
    if (elementExists(document.getElementById('inviteFollowupSurveyBtn'))) document.getElementById('inviteFollowupSurveyBtn').style.display='block';
}

// Floating matrix headers
var matrices = [];
function enabledFloatingMatrixHeaders()
{
    var isSurvey = (page == 'surveys/index.php');
    if (!$('#questiontable').length) return;

    var form = $('#questiontable');
    var formPosLeft = form.position().left;
    var formWidth = form.width();
    var offset = isSurvey ? 0 : $('#west').width();
    var mtx_bgcolor = $('.labelmatrix ').css('background-color');

    // Destroy existing scroll-triggered function to reset it
    $(window).off("scroll", scrollHandler);

    // If no visible matrixes, then stop here
    if (!$('.headermatrix:visible').length) return;

    // Destroy all existing (in case this function has already been run)
    $('.floatMtxHdr').remove();

    // create floating headers
    var i = 0;
    $('.headermatrix:visible').each(function () {
        var header = $(this);
        var floatingHeader = $('<div></div>').append(header.clone());
        matrices[i++] = {
            "header": header,
            "floatingHeader": floatingHeader
        };
        floatingHeader
            .addClass('floatMtxHdr')
            .css({
                position: 'fixed',
                display: 'none',
                top: '-5px',
                left: (formPosLeft+offset)+'px',
                width: formWidth,
                'border': '1px solid #dddddd',
                'padding-bottom': '5px',
                'padding-left': formWidth - header.width(),
                'background-color': mtx_bgcolor
            });
        // Remove IDs of columns to prevent conflict with originals
        floatingHeader.find('td').each(function(){
            if ($(this).prop('id') != '') $(this).removeAttr('id');
        })
        // Add to body
        $('body').append(floatingHeader);
    });

    // decide when to show each floating header based on scroll
    $(window).scroll(scrollHandler);
}
var scrollHandler = function()
{
    var isSurvey = (page == 'surveys/index.php');
    var offsetTop = (!isSurvey && $('.rcproject-navbar:visible').length) ? $('.rcproject-navbar').outerHeight() : 0;
    var scrollTop = $(window).scrollTop();
    for (var i = 0; i < matrices.length; i++) {
        try {
            var header = matrices[i].header;
            var matrixGroup = header.attr('hdrmtxgrp');
            var inViewport = false;
            $('#questiontable tr.mtxfld[mtxgrp="'+matrixGroup+'"]').each(function(){
                if ($(this).visible(true)) {
                    inViewport = true;
                    return;
                }
            });
            var floatingHeader = matrices[i].floatingHeader;
            if (inViewport) {
                var headerTop = header.offset().top;
                var lastRow = $('#questiontable tr.mtxfld[mtxgrp=' + matrixGroup + ']:visible:last');
                var lastRowTop = lastRow.offset().top;
                if (scrollTop > headerTop && scrollTop <= lastRowTop) {
                    var top = 0;
                    if (scrollTop > (lastRowTop - floatingHeader.height())) top = -(scrollTop - (lastRowTop - floatingHeader.height()) + 2);		// + 2 to prevent floating header from overlapping last row
                    floatingHeader.css({
                        display: 'block',
                        top: offsetTop + top + 'px'
                    });
                } else {
                    floatingHeader.css({
                        display: 'none'
                    });
                }
            } else {
                floatingHeader.css({
                    display: 'none'
                });
            }
        } catch(e){}
    }
}

// Update checkboxes for piping
function updatePipingCheckboxes(ob) {
    var name = $(ob).attr('name').substring(8, $(ob).attr('name').length);
    var labelsChecked = new Array(), valsChecked = new Array(), i=0;
    var labelsUnchecked = new Array(), valsUnchecked = new Array(), j=0;
    var isMatrix = $(ob).parent().hasClass('choicematrix');
    var matrixName = isMatrix ? $(ob).parentsUntil('table').parent().parentsUntil('tr').parent().attr('mtxgrp') : "";
    // Get labels of all choices checked
    $('form#form input[name="__chkn__'+name+'"]').each(function(){
        var thisCode = $(this).attr('code');
        var thisLabel = isMatrix ? $('#matrixheader-'+matrixName+'-'+thisCode).text().trim() : $(this).parent().text().trim();
        var thisChecked = $(this).prop('checked');
        var thisCheckedText = thisChecked ? lang_checked : lang_unchecked;
        var thisCheckedVal = thisChecked ? '1' : '0';
        if (thisChecked) {
            labelsChecked[i] = thisLabel;
            valsChecked[i] = thisCode;
            i++;
        } else {
            labelsUnchecked[j] = thisLabel;
            valsUnchecked[j] = thisCode;
            j++;
        }
        // Set "checked"/"unchecked" for any using [checkbox(code)]
        $(piping_receiver_class_field_js+event_id+'-'+name+'-choice-'+thisCode+'-label').html(thisCheckedText);
        $(piping_receiver_class_field_js+event_id+'-'+name+'-choice-'+thisCode+'-value').html(thisCheckedVal);
    });
    // If value is a Missing Data Code
    if (missing_data_codes_check && $('#'+name+'_MDLabel:visible').length) {
        labelsChecked[0] = $('#'+name+'_MDLabel').attr('label');
        valsChecked[0] = $('#'+name+'_MDLabel').attr('code');
    }
    // Set value for all piping receivers on page
    if (labelsChecked.length == 0) labelsChecked[0] = missing_data_replacement_js;
    if (labelsUnchecked.length == 0) labelsUnchecked[0] = missing_data_replacement_js;
    if (valsChecked.length == 0) valsChecked[0] = missing_data_replacement_js;
    if (valsUnchecked.length == 0) valsUnchecked[0] = missing_data_replacement_js;
    $(piping_receiver_class_field_js+event_id+'-'+name+'-checked-checked-label').html(labelsChecked.join(', '));
    $(piping_receiver_class_field_js+event_id+'-'+name+'-checked-unchecked-label').html(labelsUnchecked.join(', '));
    $(piping_receiver_class_field_js+event_id+'-'+name+'-checked-checked-value').html(valsChecked.join(', '));
    $(piping_receiver_class_field_js+event_id+'-'+name+'-checked-unchecked-value').html(valsUnchecked.join(', '));
}

// Radio fields
function updatePipingRadiosDo(ob) {
    // Remove "___radio" from end of name
    var name = ob.attr('name').substring(0, ob.attr('name').length-8);
    var label = ob.parent().html();
    // Remove radio input from label
    if (ob.attr('label') != null) {
        label = ob.attr('label');
    } else {
        label = label.substring(label.indexOf('>')+2);
    }
    if (label.substring(0,7) == '<label ') {
        // In case the label is still inside a <label> tag, get the contents of the tag
        label = $(label).first().html();
    }
    var val = (ob.val() != '') ? ob.val() : missing_data_replacement_js;
    updatePipingRadiosDoValLabel(name,val,label);
}
function updatePipingRadiosDoValLabel(name,val,label) {
    // Set value for all piping receivers on page
    $(piping_receiver_class_field_js+event_id+'-'+name).html(label);
    $(piping_receiver_class_field_js+event_id+'-'+name+'-label').html(label);
    $(piping_receiver_class_field_js+event_id+'-'+name+'-value').html(val);
    // Update drop-down options separately via ajax
    try{ updatePipingDropdowns(name,val); } catch(e) { }

}
function updatePipingRadios(selector) {
    $(selector).click(function(){
        updatePipingRadiosDo($(this));
    });
}

// Drop-down fields
function updatePipingDropdownsPre(selector) {
    $(selector).change(function(){
        var name = $(this).attr('name');
        // Find selected option to get its label
        var label = ($(this).val() != '') ? $("form#form select[name='" + name + "'] option:selected").text() : missing_data_replacement_js;
        var val = ($(this).val() != '') ? $(this).val() : missing_data_replacement_js;
        if (missing_data_codes_check && in_array($(this).val(), missing_data_codes)) {
            // Remove parentheses from label
            var posLastParen = label.lastIndexOf('(');
            if (posLastParen > 0) {
                label = label.substr(0, posLastParen).trim();
            }
        }
        // Set value for all piping receivers on page
        $(piping_receiver_class_field_js+event_id+'-'+name).html(label);
        $(piping_receiver_class_field_js+event_id+'-'+name+'-label').html(label);
        $(piping_receiver_class_field_js+event_id+'-'+name+'-value').html(val);
        // Update drop-down options separately via ajax
        updatePipingDropdowns(name,val);
    });
}

// Text fields
function updatePipingTextFields(selector) {
    $(selector).blur(function(){
        if ($(this).hasClass('autosug-search')) {
            var idname = $(this).prop('id').split('-');
            var name = idname[0];
            var val = $('#'+$(this).prop('id')+'-span').val();
        } else {
            var name = $(this).attr('name');
            var val = $(this).val();
        }
        val = (val != '') ? nl2br(filter_tags(val)) : missing_data_replacement_js;
        // Set value for all piping receivers on page
        $(piping_receiver_class_field_js+event_id+'-'+name).html(val);
        $(piping_receiver_class_field_js+event_id+'-'+name+'-label').html(val);
        // Update drop-down options separately via ajax
        updatePipingDropdowns(name,val);
    });
}

// Check if any checkboxes in a group are checked
function anyChecked(formname, field) {
    var numChecked = 0;
    var domfld = document.forms[formname].elements[field];
    // If field doesn't exist, it must be a "descriptive" field
    try {
        var fldexists = (domfld != null);
    } catch(e) {
        try {
            var fldexists = (domfld.value != null);
        } catch(e) {
            var fldexists = false;
        }
    }
    if (!fldexists) return 0;
    var chkLen2 = domfld.length;
    if (chkLen2) {
        for (var x = 0; x < chkLen2; x++) {
            if (document.forms[formname].elements[field][x].checked) numChecked++;
        }
    } else {
        if (document.forms[formname].elements[field].checked) numChecked++;
    }
    return numChecked;
}

//Functions used in Branching Logic for hiding/showing fields
function checkAll(flag, formname, field) {
    var this_code;
    eval("var chkLen=document."+formname+"."+field+".length;");
    if (chkLen) {
        for (var x = 0; x < chkLen; x++) {
            if (flag == 1) {
                eval("document."+formname+"."+field+"[x].checked = true;");
            } else {
                eval("document."+formname+"."+field+"[x].checked = false;"
                    +"this_code = document."+formname+"."+field+"[x].getAttribute('code');");
                try {
                    eval("document." + formname + ".__chk__" + field.substring(8) + "_RC_" + replaceDotInCheckboxCoding(this_code) + ".value='';");
                } catch(e) {
                    document.getElementById("id-__chk__" + field.substring(8) + "_RC_" + replaceDotInCheckboxCoding(this_code)).value = '';
                }
            }
        }
    } else {
        if (flag == 1) {
            eval("document."+formname+"."+field+".checked = true;");
        } else {
            eval("document."+formname+"."+field+".checked = false;"
                +"this_code = document."+formname+"."+field+".getAttribute('code');");
            try {
                eval("document." + formname + ".__chk__" + field.substring(8) + "_RC_" + replaceDotInCheckboxCoding(this_code) + ".value='';");
            } catch(e) {
                document.getElementById("id-__chk__" + field.substring(8) + "_RC_" + replaceDotInCheckboxCoding(this_code)).value = '';
            }
        }
    }
}

// Return boolean for whether DOM element exists
function elementExists(domfld) {
    try {
        return (domfld != null);
    } catch(e) {
        return false;
    }
}

// Function called when a calculated field's value gets changed via JavaScript
function calcChangeCheck(newval, oldval, this_field) {
    // Set data change flag
    if (newval != oldval) dataEntryFormValuesChanged = true;
    // Add visual marker after field
    $(function(){
        var domfld = $('form#form input[name="'+this_field+'"]');
        var savedval = domfld.attr('sv');
        if (savedval+"" !== newval+"") {
            domfld.addClass('calcChanged');
            domfld.change();
        } else {
            domfld.removeClass('calcChanged');
        }
    });
}

// Evaluate branching logic and show/hide table row based upon its evaluation
function evalLogic(this_field, byPassEraseFieldPrompt, logic, parentField) {
    if (typeof parentField == 'undefined') parentField = false;
    var showHideAction = null;
    if (logic == false) {
        // HIDE ROW
        var is_chkbx = 0;
        var fldLen = 0;
        eval("var domfld = document.forms['form']."+this_field+";");
        if (isIE) {
            try {
                var fldexists = (domfld.value != null);
                if (fldexists) fldLen = domfld.value.length;
            } catch(e) {
                var fldexists = false;
                var fldLen = 0;
            }
        } else {
            var fldexists = (domfld != null);
            if (fldexists) fldLen = domfld.value.length;
        }
        if (!fldexists) {
            // Checkbox fields (might also be a "descriptive" field)
            var fldLen = anyChecked("form","__chkn__"+this_field);
            is_chkbx = 1;
        }
        var hasMissingDataCode = false;
        // HIDE ROW
        if (fldLen > 0) {
            // Determine if we should erase the value or prompt to erase the value
            if (showEraseValuePrompt) {
                // If using randomization, make sure we're not going to erase the randomization field or stata field values
                if (randomizationCriteriaFieldList != null && in_array(this_field, randomizationCriteriaFieldList)) {
                    // Randomization fields CANNOT be hidden after randomization has happened, so stop here.
                    return false;
                }
                // Determine if we should prompt the user and erase the value
                hasMissingDataCode = (missing_data_codes_check && typeof domfld != 'undefined' && domfld.value != '' && in_array(domfld.value, missing_data_codes));
                var eraseIt = (page == 'surveys/index.php') ? true : (byPassEraseFieldPrompt ? false : (hasMissingDataCode ? true : confirm(brErase(this_field))));
            } else {
                var eraseIt = false;
            }
            if (eraseIt) {
                showHideAction = 'hide';
                if (!hasMissingDataCode) {
                    if (is_chkbx) {
                        // Checkbox fields
                        checkAll(0, "form", "__chkn__" + this_field);
                    } else {
                        // If a radio field, additionally make sure the radio buttons are all unchecked
                        if (document.forms['form'].elements[this_field + '___radio'] != null) {
                            domfld.value = '';
                            uncheckRadioGroup(document.forms['form'].elements[this_field + '___radio']);
                        }
                        // If a select field with auto-complete enabled, then reset the text field value too
                        if (document.getElementById('rc-ac-input_' + this_field) != null) {
                            domfld.value = '';
                            document.getElementById('rc-ac-input_' + this_field).value = '';
                        }
                        // If a slider field, then reset the slider
                        else if (document.forms['form'].elements[this_field] != null && document.forms['form'].elements[this_field].getAttribute('class') != null
                            && document.forms['form'].elements[this_field].getAttribute('class').indexOf('sldrnum') > -1) {
                            resetSlider(this_field);
                        }
                        // If a file upload field, then reset the field
                        else if (elementExists(document.getElementById('fileupload-container-'+this_field)))  {
                            $(function(){
                                $('#fileupload-container-'+this_field).removeClass('hidden');
                                // If deleting a file/signature, then give delete prompt so that the user understands they are deleting a file
                                $('#fileupload-container-'+this_field+' .deletedoc-lnk').trigger('click');
                            });
                        } else {
                            // Reset field value
                            domfld.value = '';
                        }
                    }
                }
                document.getElementById(this_field+'-tr').style.display='none';
                // Remove "hasval" attribute from row
                if (document.getElementById(this_field+'-tr').getAttribute('hasval') != null) {
                    document.getElementById(this_field+'-tr').removeAttribute('hasval');
                }
            } else if (!eraseIt && parentField != false) {
                evalLogic(parentField, byPassEraseFieldPrompt, true);
            }
        } else {
            showHideAction = 'hide';
            if (elementExists(document.getElementById(this_field+'-tr'))) {
                document.getElementById(this_field+'-tr').style.display='none';
            }
        }
        // If any fields are embedded inside this field that is being hidden, then also check if their value needs to be cleared out too
        if (elementExists(document.getElementById(this_field+'-tr'))) {
            var a = document.querySelector('#' + this_field + '-tr').querySelectorAll('.rc-field-embed');
            for (var i = 0; i < a.length; i++) {
                evalLogic(a[i].getAttribute('var'), byPassEraseFieldPrompt, false, this_field);
            }
        }
    } else {
        // SHOW ROW
        var showit = true;
        showHideAction = 'show';
        if (page == 'surveys/index.php') {
            // Survey page: Treat differently since it contains fields on the form that might need to remain hidden (because of multi-paging)
            if (document.getElementById(this_field+'-tr').getAttribute('class') != null) {
                if (document.getElementById(this_field+'-tr').getAttribute('class').indexOf('hidden') > -1) {
                    // If row has class 'hidden', then keep hidden
                    showit = false;
                }
            }
        }
        // Do not show it if it has any @HIDDEN action tag
        if (showit && document.getElementById(this_field+'-tr').getAttribute('class') != null) {
            var rowClasses = document.getElementById(this_field+'-tr').getAttribute('class').split(" ");
            if (in_array('@HIDDEN', rowClasses)
                || (page != 'surveys/index.php' && in_array('@HIDDEN-FORM', rowClasses))
                || (page == 'surveys/index.php' && in_array('@HIDDEN-SURVEY', rowClasses))
            ) {
                showit = false;
            }
        }
        if (showit) {
            // Now show the row, if applicable
            document.getElementById(this_field+'-tr').style.display = (isIE && IEv<10 ? 'block' : 'table-row');
            // If any fields are embedded inside this field that is being shown, then by default make all embedded fields visible (their individual branching will be checked below, if applicable)
            var a = document.querySelector('#'+this_field+'-tr').querySelectorAll('.rc-field-embed');
            for (var i = 0; i < a.length; i++) {
                a[i].style.display = 'inline';
            }
        }
    }
    // If field is embedded inside another field, then show/hide the embedded field based on their branching logic
    var a = document.querySelectorAll('.rc-field-embed[var="'+this_field+'"]');
    for (var i = 0; i < a.length; i++) {
        a[i].style.display = (showHideAction == 'hide') ? 'none' : 'inline';
    }
}

// Action Tags: Function that is run on forms and surveys to perform actions based on tags in the Field Annotation text
function triggerActionTags() {
    // Is this a survey page?
    var isSurvey = (page == 'surveys/index.php');

    // Note: @HIDDEN tags are handled via CSS and also inside doBranching()
    // on forms/surveys, so we don't need to force them to be hidden here.

    // DISABLES ANY FIELD THAT CONTAINS @READONLY
    // Disable survey and form
    $("#questiontable tr.\\@READONLY").disableRowActionTag();
    // Disable surveyonly
    if (isSurvey) $("#questiontable tr.\\@READONLY-SURVEY").disableRowActionTag();
    // Disable formonly
    else $("#questiontable tr.\\@READONLY-FORM").disableRowActionTag();
}

// Hide row via @HIDDEN action tag
function triggerActionTagsHidden(isSurvey) {
    // Note: This is already done by CSS, but this is in case branching logic tries to reveal it.
    // Hide survey and form
    $("#questiontable tr.\\@HIDDEN").hide();
    // Hide surveyonly
    if (isSurvey) $("#questiontable tr.\\@HIDDEN-SURVEY").hide();
    // Hide formonly
    else $("#questiontable tr.\\@HIDDEN-FORM").hide();
}

// Disable row via @READONLY action tag
(function ( $ ) {
    $.fn.disableRowActionTag = function() {
        var tr = this;
        if (tr.length < 1) return;
        // Disable all inputs row, trigger blur (to update any piping), and gray out whole row
        $('input, select, textarea', tr).prop("disabled", true);
        // Disable buttons and all text links (ignore images surrounded by links, we just want text links)
        $('a:not(a:has(img))', tr).each(function(){
            $(this).attr('onfocus', '');
            if ($(this).hasClass('fileuploadlink')) {
                $(this).attr('href', 'javascript:;').attr('onclick', 'return false;');
            }
        });
        $('button, .ui-datepicker-trigger', tr).hide();
        // Disable sliders
        $("[id^=sldrmsg-]", tr).css('visibility','hidden');
        $("[id^=slider-]", tr).attr('onmousedown', '').slider("disable");
        setTimeout(function(){ $("[id^=slider-]", tr).slider("disable"); },100);
        setTimeout(function(){ $("[id^=slider-]", tr).slider("disable"); },1000);
    };
}( jQuery ));

// Improve onchance event of text/notes fields to trigger branching logic before leaving the field
// (so that we don't skip over the next field, which becomes displayed)
var currentFocusTextField = null;
var bypassBranchingErrors = false;
function improveBranchingInitIntervalCheck() {
    // If field not set, turn on checker
    if (currentFocusTextField === null) {
        improveBranchingDisableIntervalCheck();
        return;
    }
    $.doTimeout('improveBranchingCheck', 2000, function(){
        // If this is unset by the end of the delay, then stop it
        if (currentFocusTextField === null) {
            improveBranchingDisableIntervalCheck();
            return;
        }
        // Obtain the initial value of field during onfocus
        var initValue = currentFocusTextField.data('val');
        if (initValue != currentFocusTextField.val()) {
            // Set new initial value
            currentFocusTextField.data('val', currentFocusTextField.val());
            // Do branching
            bypassBranchingErrors = true;
            doBranching(currentFocusTextField.attr('name'),true);
            bypassBranchingErrors = false;
        }
        // Wait another interval and re-run
        improveBranchingInitIntervalCheck();
    });
}
function improveBranchingDisableIntervalCheck() {
    currentFocusTextField = null;
    bypassBranchingErrors = false;
    try {
        $.doTimeout('improveBranchingCheck', false);
    } catch(e) { }
}
function improveBranchingOnchange() {
    $('form#form input[type="text"], form#form textarea').focus(function(){
        // Only set this variable for text/notes fields that will trigger branching
        currentFocusTextField = null;
        var attr = $(this).attr('onchange');
        if (typeof attr !== typeof undefined && attr !== false && attr.indexOf('doBranching(') > -1) {
            currentFocusTextField = $(this);
            // Set original value at the time of focus
            $(this).data('val', currentFocusTextField.val());
        }
        // Initiate checking value at an interval
        improveBranchingInitIntervalCheck();
    });
    $('form#form input[type="text"], form#form textarea').blur(function(){
        improveBranchingDisableIntervalCheck();
    });
}

// Run when clicking a checkbox on a survey/form
function checkboxClick(field, value, that, e, maxchecked) {
    var elementClicked = '';
    var isCheckboxClicked = false;
    var targetName = $(e.target).attr('name');
    try {
        elementClicked = e.target.nodeName.toLowerCase();
        isCheckboxClicked = (elementClicked == 'input' && $(e.target).attr('type') == 'checkbox');
    } catch(error) { }
    // Deal with other fields embedded inside the checkbox labels
    if (typeof targetName != 'undefined' && field != '__chkn__'+targetName && targetName.indexOf('___radio') < 0) {
        // If the field being clicked is not the checkbox field, then we have an embedded field being clicked in the parent checkbox's label
        e.stopPropagation();
    } else if (typeof targetName == 'undefined' && $('.rc-field-embed[var="'+field+'"]').length && elementClicked == 'label' && $(that).hasClass('mc')) {
        // Use the label ID to determine this embedded checkbox's ID, and then check/uncheck the associated checkbox (since it will not automatically get checked/unchecked simply by clicking its label here)
        var labelIdParts = $(that).prop('id').split('-');
        var embeddedCheckboxId = '#id-__chk__'+labelIdParts[1]+'_RC_'+labelIdParts[2];
        var isEmbeddedCheckboxClicked = $(embeddedCheckboxId).prop('checked');
        $(embeddedCheckboxId).prop('checked', !isEmbeddedCheckboxClicked);
        e.stopPropagation();
    }
    try {
        if (isCheckboxClicked) {
            var checkbox = $(that);
        } else if (elementClicked == 'label') {
            var checkbox = $(that).parent().find('input[type="checkbox"]:first');
        } else {
            return;
        }
        var wasJustChecked = checkbox.prop('checked');
        if (wasJustChecked && maxchecked > 0 && $('input[type="checkbox"][name="__chkn__'+field+'"]:checked').length > maxchecked) {
            // Uncheck it
            checkbox.prop('checked',false);
            // Set value of hidden field to blank
            $('input[name="__chk__'+field+'_RC_'+replaceDotInCheckboxCoding(value)+'"]').val('');
            // Show temporary note about it being unchecked
            setPositionMaxcheckedActionTagAlert(checkbox);
            return;
        }
        // Set value of hidden field
        $('input[name="__chk__'+field+'_RC_'+replaceDotInCheckboxCoding(value)+'"]').val( wasJustChecked ? value : '' );
        calculate(field);
        doBranching(field);
    } catch(e) { }
}

// Fix desciptive text images for mobile devices
function fitImg(ob) {
    if (!isMobileDevice) return;
    ob = $(ob);
    if (ob.attr('nativedim') == '1') return;
    var whratio= ob.parent().width()/ob.width();
    if (whratio > 1) {
        ob.css({'width':rounddown(ob.width()*whratio)+'px','max-width':rounddown(ob.width()*whratio)+'px',
            'height':rounddown(ob.height()*whratio)+'px','max-height':rounddown(ob.height()*whratio)+'px'});
    }
}

function setPositionMaxcheckedActionTagAlert(that) {
    var enhanced_choice_fudge = that.hasClass('enhancedchoice') ? '250' : '100';
    var maxchoice_label = $('#maxchecked_tag_label');
    maxchoice_label.show().position({
        my:        "left top",
        at:        "left+"+enhanced_choice_fudge+" top",
        of:        that
    });
    setTimeout(function(){
        maxchoice_label.hide();
    },4000);
}

// Implement @NONEOFTHEABOVE action tag for checkboxes
function noneOfTheAboveAlert(field, choicesCsv, regchoicesCsv, langOkay, langCancel) {
    var noneOfTheAboveCurrentField = '';
    var noneOfTheAboveNotCurrentField = '';
    var choices = choicesCsv.split(",");
    var regchoices = regchoicesCsv.split(",");
    for (var i=0; i<choices.length; i++) {
        if (noneOfTheAboveCurrentField != '') noneOfTheAboveCurrentField += ', ';
        noneOfTheAboveCurrentField += 'input[name="__chkn__'+field+'"][code="'+choices[i]+'"]';
    }
    for (var i=0; i<regchoices.length; i++) {
        if (noneOfTheAboveNotCurrentField != '') noneOfTheAboveNotCurrentField += ', ';
        noneOfTheAboveNotCurrentField += 'input[name="__chkn__'+field+'"][code="'+regchoices[i]+'"]';
    }
    // Click trigger for ALL options except the NONEOFTHEABOVE option
    $(noneOfTheAboveNotCurrentField).click(function(){
        // Deselect the NONEOFTHEABOVE option(s)
        $(noneOfTheAboveCurrentField).each(function(){
            if ($(this).prop('checked')) {
                var thisCode = $(this).attr('code');
                $(this).prop('checked', false);
                $(this).parent().find('input[type="hidden"]').val('');
                $('#'+field+'-tr .enhancedchoice label.selectedchkbox[comps="'+field+',code,'+thisCode+'"]')
                    .removeClass('selectedchkbox').addClass('unselectedchkbox');
                dataEntryFormValuesChanged = true;
                try{ updatePipingCheckboxes(this); }catch(e){ }
            }
        });
    });
    // Click trigger for NONEOFTHEABOVE option
    $(noneOfTheAboveCurrentField).click(function(){
        var regChoicesChecked = 0;
        var thisCode = $(this).attr('code');
        // If no other choices are selected, then do nothing
        if ($('input[name="__chkn__'+field+'"]:not([code="'+thisCode+'"]):checked').length == 0) {
            return;
        }
        // Place the choice text inside the dialog
        if ($('#label-'+field+'-'+thisCode).length) {
            $('#noneOfTheAboveLabelDialog').html( $('#label-'+field+'-'+thisCode).text() );
        } else {
            $('#noneOfTheAboveLabelDialog').html( $('#matrixheader-'+$('#'+field+'-tr').attr('mtxgrp')+'-'+thisCode).text() );
        }
        // Make sure it was checked (in case using @MAXCHECKED action tag)
        $('input[name="__chkn__'+field+'"][code="'+thisCode+'"]').prop('checked',true);
        $('#maxchecked_tag_label').hide();
        // Dialog
        $('#noneOfTheAboveDialog').dialog({ bgiframe: true, modal: true, width: 450,
            close: function(){
                // If close dialog, uncheck the checkbox and set the hidden input as blank
                var thisOb = $('input[name="__chkn__'+field+'"][code="'+thisCode+'"]');
                thisOb.prop('checked', false);
                thisOb.parent().find('input[type="hidden"]').val('');
                $('#'+field+'-tr .enhancedchoice label.selectedchkbox[comps="'+field+',code,'+thisCode+'"]')
                    .removeClass('selectedchkbox').addClass('unselectedchkbox');
                try{ updatePipingCheckboxes(thisOb); }catch(e){ }
            },
            buttons: [
                { text: langCancel, click: function() {
                        $(this).dialog('close');
                    }},
                {text: langOkay, click: function() {
                        // Okay button: Uncheck all other checkbox options and set their hidden input as blank
                        var thisOb = $('input[name="__chkn__'+field+'"]:not([code="'+thisCode+'"]):checked');
                        thisOb.each(function(){
                            var thisCode2 = $(this).attr('code');
                            $(this).prop('checked', false);
                            $(this).parent().find('input[type="hidden"]').val('');
                            $('#'+field+'-tr .enhancedchoice label.selectedchkbox[comps="'+field+',code,'+thisCode2+'"]')
                                .removeClass('selectedchkbox').addClass('unselectedchkbox');
                        });
                        try{ updatePipingCheckboxes(thisOb); }catch(e){ }
                        dataEntryFormValuesChanged = true;
                        calculate(field);
                        doBranching(field);
                        $(this).dialog('destroy');
                    }}
            ] });
    });
}

// Implement the @WORDLIMIT and @CHARLIMIT action tags
function wordcharlimit(field, type, goal, msg) {
    var ob = $('input[name="'+field+'"], textarea[name="'+field+'"]');
    ob.after('<div id="wordcharcounter-'+type+'-'+field+'" class="wordcharcounter"></div>');
    ob.counter({ type: type, count: 'down', msg: msg, goal: goal, target: '#wordcharcounter-'+type+'-'+field });
}

// In case data entry forms don't fully load, which would prevent the save button group drop-downs
// from working, use this replacement method to make sure the drop-down opens regardless.
function openSaveBtnDropDown(ob,e) {
    e.stopPropagation();
    var btngroup = $(ob).parent();
    if (btngroup.hasClass('show')) {
        // Close it
        btngroup.removeClass('show');
        btngroup.find('.dropdown-menu').removeClass('show');
    } else {
        // Open it
        btngroup.addClass('show');
        btngroup.find('.dropdown-menu').addClass('show');
    }
}

// If any enhanced choice fields are hidden due to branching logic, then make sure their UI shows them as unselected
function updateHiddenEnhancedChoices() {
    $('label.selectedradio:not(:visible)').removeClass('selectedradio');
    $('label.selectedchkbox:not(:visible)').removeClass('selectedchkbox').addClass('unselectedchkbox');
}

// Action when selecting an Enhanced Choice radio or checkbox
function enhanceChoiceSelect(ob, maxchecked) {
    var label = $(ob);
    var attr = label.attr('comps').split(',');
    var type = attr[1] == 'code' ? 'checkbox' : 'radio';
    // Set the element class
    if (type == 'checkbox') {
        var input = $('input[name="__chkn__'+attr[0]+'"]['+attr[1]+'="'+attr[2]+'"]');
        if (input.prop('checked')) {
            label.removeClass('selectedchkbox').addClass('unselectedchkbox');
        } else {
            // Deal with maxchecked action tag
            if (isNumeric(maxchecked) && maxchecked > 0 && $('input[name="__chkn__'+attr[0]+'"]:checked').length >= maxchecked) {
                // Since we hit the max, stop here to prevent it from being checked
                setPositionMaxcheckedActionTagAlert(label.parent());
                return;
            }
            label.removeClass('unselectedchkbox').addClass('selectedchkbox');
        }
    } else {
        var input = $('input[name="'+attr[0]+'___radio"]['+attr[1]+'="'+attr[2]+'"]');
        if (!input.length) {
            // PROMIS inputs
            input = $('input[name="'+attr[0]+'"]['+attr[1]+'="'+attr[2]+'"]');
        }
        // First, set all unchecked
        label.parentsUntil('div.enhancedchoice_wrapper').parent().find('div.enhancedchoice label').removeClass('selectedradio');
        // Now set the one selected one
        label.addClass('selectedradio');
    }
    // Trigger the original input
    input.trigger('click');
    dataEntryFormValuesChanged = true;
}

// On forms/surveys, make sure dropdowns don't get too wide so that they create horizontal scrollbar
function shrinkWideDropDowns() {
    // Get width of viewport
    var winWidth = $(window).width();
    // If we don't have a horizontal scrollbar, then do nothing
    if ($(document).width() <= winWidth) return;
    // Loop through each drop-down
    $('form#form select.x-form-text').each(function(){
        var dd = $(this);
        var posDdLeft = dd.offset().left
        var posDdRight = posDdLeft + dd.width();
        // If drop-down spills off page, then resize it
        if (posDdRight > winWidth) dd.css('width','95%');
    });
}

// Enable all action tags
function enableActionTags() {
    // If we're viewing a response on a form but not in edit mode, then stop here
    if ($('#edit-response-btn').length && $('#SurveyActionDropDown').length && getParameterByName('editresp') != '1') return;
    // Track any changes made
    var changes = 0;
    // Enable NOW/TODAY action tags
    $("#questiontable tr.\\@NOW, #questiontable tr.\\@TODAY, #questiontable tr.\\@NOW-SERVER, #questiontable tr.\\@TODAY-SERVER, #questiontable tr.\\@NOW-UTC, #questiontable tr.\\@TODAY-UTC").each(function(){
        var name = $(this).attr('sq_id');
        var input = $('#questiontable input[name="'+name+'"]');
        var fv = (input.attr('fv') == null) ? '' : input.attr('fv');
        var dateFVs = new Array('date_mdy', 'date_dmy', 'date_ymd');
        // Add value if doesn't already have a value
        if (input.val() == '') {
            if (fv == 'time') {
                // NOW for time fields
                document.forms['form'].elements[name].value = currentTime('both');
            } else if ($(this).hasClass("\@NOW-SERVER")) {
                // NOW-SERVER for datetime fields (if detect a date field, then fall back to inserting date instead of datetime)
                var showSeconds = (fv == '' || fv.indexOf('datetime_seconds') === 0);
                if (fv.indexOf('_dmy') > -1) {
                    var thisNow = now_dmy;
                } else if (fv.indexOf('_mdy') > -1) {
                    var thisNow = now_mdy;
                } else {
                    var thisNow = now;
                }
                if (in_array(fv, dateFVs)) thisNow = thisNow.substring(0,10);
                if (!showSeconds)  thisNow = thisNow.substring(0,16);
                document.forms['form'].elements[name].value = thisNow;
            } else if ($(this).hasClass("\@NOW-UTC")) {
                // NOW for datetime fields (if detect a date field, then fall back to inserting date instead of datetime)
                var thisNow = getCurrentDate(fv, true)+' '+currentTime('both',(fv == '' || fv.indexOf('datetime_seconds') === 0), true);
                if (in_array(fv, dateFVs)) thisNow = thisNow.substring(0,10);
                document.forms['form'].elements[name].value = thisNow;
            } else if ($(this).hasClass("\@NOW")) {
                // NOW for datetime fields (if detect a date field, then fall back to inserting date instead of datetime)
                var thisNow = getCurrentDate(fv)+' '+currentTime('both',(fv == '' || fv.indexOf('datetime_seconds') === 0));
                if (in_array(fv, dateFVs)) thisNow = thisNow.substring(0,10);
                document.forms['form'].elements[name].value = thisNow;
            } else if ($(this).hasClass("\@TODAY-SERVER")) {
                // TODAY-SERVER for date fields
                if (fv.indexOf('_dmy') > -1) {
                    var thisToday = today_dmy;
                } else if (fv.indexOf('_mdy') > -1) {
                    var thisToday = today_mdy;
                } else {
                    var thisToday = today;
                }
                document.forms['form'].elements[name].value = thisToday;
            } else if ($(this).hasClass("\@TODAY-UTC")) {
                // TODAY-UTC for date fields
                document.forms['form'].elements[name].value = getCurrentDate(fv, true);
            } else if ($(this).hasClass("\@TODAY")) {
                // TODAY for date fields
                document.forms['form'].elements[name].value = getCurrentDate(fv);
            }
            input.addClass('calcChanged');
            // Increment changes count
            changes++;
        }
    });
    // Enable LATITUTE/LONGITUDE action tags
    var changesGPS = 0;
    $("#questiontable tr.\\@LATITUDE, #questiontable tr.\\@LONGITUDE").each(function(){
        var name = $(this).attr('sq_id');
        // Disable field
        $('#questiontable input[name="'+name+'"]').prop('readonly',true);
        // Add GPS value
        if (document.forms['form'].elements[name].value == '') {
            changes += getGeolocation(($(this).hasClass("\@LATITUDE") ? 'latitude' : 'longitude'), name, 'form');
        }
    });
    // Trigger branching and calculations if changes were made
    if (changes > 0) {
        dataEntryFormValuesChanged = true;
        setTimeout(function(){try{calculate(name);doBranching(name);}catch(e){}},50);
    }
}

// Obtain the latitute or longitude of the user (direction = 'latitude' or 'longitude')
// and place the value inside an input field with specified 'input_name'.
// Note: It will *only* add the lat/long if the input is blank/empty.
function getGeolocation(direction,input_name,form_name,overwrite) {
    if (direction == null || input_name == null || direction == '' || input_name == '') return 0;
    if (overwrite == null) overwrite = false;
    // Get the position
    if (geoPosition.init()){
        geoPosition.getCurrentPosition(function(p){
            // Set form and input
            if (form_name == null) form_name = 'form';
            var myinput = document.forms[form_name].elements[input_name];
            // Make sure this is a textarea or input
            if (myinput.type != 'text') return;
            // Add lat or long to input
            if (overwrite == true || myinput.value == '') {
                if (direction == 'latitude') {
                    myinput.value = p.coords.latitude;
                } else if (direction == 'longitude') {
                    myinput.value = p.coords.longitude;
                }
                // Call calculations/branching
                try{calculate(input_name);doBranching(input_name);}catch(e){}
                $('#questiontable input[name="'+input_name+'"]').addClass('calcChanged');
            }
        },function(){ },{enableHighAccuracy:true});
        return 1;
    }
    return 0;
}

// AUTO-COMPLETE FOR DROP-DOWNS: Loop through drop-down fields on the form/survey and enable auto-complete for them
function enableDropdownAutocomplete() {
    // Class to add to select box once auto-complete has been enabled
    var selectClass = "rc-autocomplete-enabled";
    // Loop through all SELECT fields
    $('select.rc-autocomplete:not(.'+selectClass+')').each(function(){
        // If missing name attribute, then ignore
        if ($(this).attr('name') == null) return;
        // Elements
        if ($('.rc-field-embed[var="'+$(this).attr('name')+'"]').length) {
            // Field is embedded, so make the field embedding span the container here (instead of the main table row)
            var $tr = $('.rc-field-embed[var="'+$(this).attr('name')+'"]');
        } else {
            // Not embedded
            var $tr = $(this).parents('tr:first');
        }
        var $dropdown = $('select:first', $tr);
        var $input = $('input.rc-autocomplete:first', $tr);
        var $button = $('button.rc-autocomplete:first', $tr);
        // Add class to denote that drop-down already has auto-complete enabled
        $dropdown.addClass(selectClass);
        // Make input width same as original drop-down
        if ($tr.css('display') != 'none') {
            $input.width( $dropdown.width() );
        } else {
            // Drop-down is hidden by branching logic, so clone it to get its width
            var ddclone = $dropdown.clone();
            ddclone.css("visibility","hidden").appendTo('body');
            $input.width( ddclone.width() );
            ddclone.remove();
        }
        // If put focus/click on blank input, open the full list
        $input.bind('focus click', function(){
            if ($(this).val() == '') {
                $input.autocomplete('search','');
            }
        });
        // Prevent form submission via Enter key in input
        $input.keydown(function(e){
            if (e.which == 13) return false;
        });
        // When user changes autocomplete input to blank value
        $input.blur(function(){
            var object_clicked_local = object_clicked;
            var thisval = $(this).val();
            var ddval = $dropdown.val();
            if (thisval == '') {
                if (ddval != '') {
                    $dropdown.val('').trigger('change');
                }
            } else {
                var isValid = false;
                var valueToSelect = '';
                $('option', $dropdown).each(function() {
                    if ($(this).text() == thisval) {
                        isValid = true;
                        valueToSelect = $(this).val();
                        return false;
                    }
                });
                // Check if the new value is valid
                if (!isValid &&
                    // object_clicked_local will be null if we just blurred out of input (as opposed to clicking)
                    (object_clicked_local == null
                        // If we just clicked on the autocomplete list (to choose an option), then don't throw an error.
                        || (object_clicked_local != null && object_clicked_local.parents('ul.ui-autocomplete').length == 0)))
                {
                    // Not a valid value
                    simpleDialog('You entered an invalid value. Please try again.','Invalid value!',null,null,"$('#"+$(this).attr('id')+"').focus().autocomplete('search',$('#"+$(this).attr('id')+"').val());");
                } else {
                    // Set drop-down to same value and trigger change
                    $dropdown.val(valueToSelect);
                    if (ddval != valueToSelect) {
                        $dropdown.trigger('change');
                    }
                }
            }
        });
        // Open full list when click button/arrow icon
        $button.mousedown(function(event){
            if ($('.ui-autocomplete:visible').length) {
                $input.autocomplete("option", "minLength", 0); // Force minLength=0 if user manually clicks down arrow button
                $(this).attr('listopen', '1');
            } else {
                $(this).attr('listopen', '0');
            }
        });
        $button.click(function(event){
            // Get list_open attribute from button
            var list_open = $(this).attr('listopen');
            if (list_open == '1') {
                // Hide the autocomplete list
                $('.ui-autocomplete').hide();
                // Change value of listopen attribute
                $(this).attr('listopen', '0');
            } else {
                // If click the down arrow icon, put cursor inside text box and open the full list
                $input.autocomplete("option", "minLength", 0); // Force minLength=0 if user manually clicks down arrow button
                $input.focus();
                if ($input.val() != '') {
                    $input.autocomplete("search", "");
                }
                // Change value of list_open attribute
                $(this).attr('listopen', '1');
            }
        });
        // When page loads, add existing value's label to input field
        if ($dropdown.val() != "") {
            var saved_val_text = $("option:selected", $dropdown).text();
            $input.val(saved_val_text).attr('value',saved_val_text); // Also set attr() in case using Randomization, which replaces text inside TD cell.
        }
        // Extract options from dropdown for jQueryUI autocomplete
        var list = $dropdown.children();
        var x = [];
        for (var i = 0; i<list.length; i++){
            var this_opt_val = list[i].value;
            if (this_opt_val != '') {
                x.push({ value: html_entity_decode(list[i].innerHTML), code: this_opt_val });
            }
        }
        // As the size of the option list increases, increase the minLength up to a max.
        // This is required to prevent fields with hundreds/thousands of options from being unreasonably slow.
        var minLength;
        if (x.length <= 200) {
            minLength = 0;
        } else if (x.length <= 500) {
            minLength = 1;
        } else if (x.length <= 2000) {
            minLength = 2;
        } else {
            minLength = Math.min(4, Math.ceil(x.length/1000));
        }
        // Initialize jQueryUI autocomplete
        $input.autocomplete({
            source: x,
            minLength: minLength,
            select: function (event, ui) {
                $dropdown.val(ui.item.code);
                $button.click();
                $dropdown.change();
            }
        })
            // Add escape character as HTML character code before the label because a single dash will turn into a divider
            .data('ui-autocomplete')._renderItem = function( ul, item ) {
            if (item.label == '-' || item.label == "\u2014" || item.label == "\u2013") {
                item.label = "&#27; " + item.label;
            }
            return $("<li></li>")
                .data("item", item)
                .append(item.label)
                .appendTo(ul);
        };
    });
}

// Select the radio button or checkbox inside "this" div/object (doesn't work on IE8 and below)
function sr(ob,e) {
    ob = $(ob);
    // Ignore if the radio button itself was clicked
    try {
        var nodeName = e.target.nodeName;
    } catch(error) {
        return;
    }
    var elementClicked = nodeName.toLowerCase();
    if (elementClicked == 'input') return;
    // Auto-click the radio/checkbox
    var isRadio = $('input[type="radio"]', ob).length;
    // if (isRadio && $('.rc-field-embed[var="'+$('input[type="radio"]:first', ob).prop('name').replace('___radio','')+'"]').length) {
        // Embedded radio
        // console.log($('input[type="radio"]:first', ob).prop('name')+' = '+$('input[type="radio"]:first', ob).prop('value'));
        //console.log('input[name="'+$('input[type="radio"]:first', ob).prop('name')+'"][value="'+$('input[type="radio"]:first', ob).prop('value')+'"]');
    //} else
    if (isRadio) {
        // Normal radio
        $('input[type="radio"]:first', ob).trigger('click');
    } else {
        // Checkbox
        var chkbox = $('input[type="checkbox"]:first', ob);
        var hidden = $('input[type="hidden"]:first', ob);
        var chkbox_checked = !chkbox.prop('checked');
        var chkbox_code = chkbox.attr('code');
        // Manually set the value of the hidden input field (because for some reason, having jQuery trigger click doesn't set this)
        hidden.val( (chkbox_checked ? chkbox_code : '') );
        // Click the checkbox
        chkbox.trigger('click');
    }
}

// Set autocomplete for BioPortal ontology search for ALL fields on a page
function initAllWebServiceAutoSuggest() {
    $('input.autosug-ont-field').each(function(){
        initWebServiceAutoSuggest($(this).attr('name'));
    });
}

// Set autocomplete for BioPortal ontology search for a field
function initWebServiceAutoSuggest(field_name,retriggerClick) {
    if ($('input#'+field_name+'-autosuggest').length < 1) return;
    // Check if autocomplete has been enabled already for this field
    if ($('input#'+field_name+'-autosuggest').hasClass('ui-autocomplete-input')) return;
    // If the data entry page is locked or is a non-editable response, then don't enable this feature
    if (($('#__SUBMITBUTTONS__-tr').length && $('#__SUBMITBUTTONS__-tr').css('display') == 'none')
        || ($('#__LOCKRECORD__').length && $('#__LOCKRECORD__').prop('checked'))) return;
    // If we need to retrigger the click (due to Online Designer not initiating this function on page load), then trigger click
    if (retriggerClick != null && retriggerClick == '1') {
        $('input[name="'+field_name+'"]').removeAttr('onclick');
        initWebServiceAutoSuggest(field_name);
        $('input[name="'+field_name+'"]').trigger('click');
        return;
    }
    // Set URLs for ajax
    if (page == 'surveys/index.php') {
        var url = dirname(app_path_webroot.substring(0,app_path_webroot.length-1))+'/surveys/index.php?s='+getParameterByName('s')+'&__passthru='+encodeURIComponent('DataEntry/web_service_auto_suggest.php')+'&field='+field_name;
        var url_cache = dirname(app_path_webroot.substring(0,app_path_webroot.length-1))+'/surveys/index.php?s='+getParameterByName('s')+'&__passthru='+encodeURIComponent('DataEntry/web_service_cache_item.php');
    } else {
        var url = app_path_webroot+'DataEntry/web_service_auto_suggest.php?pid='+pid+'&field='+field_name;
        var url_cache = app_path_webroot+'DataEntry/web_service_cache_item.php?pid='+pid;
    }
    // Init auto-complete
    $('input#'+field_name+'-autosuggest').autocomplete({
        source: url,
        minLength: 2,
        delay: 0,
        search: function( event, ui ) {
            // Show progress icon
            $('#'+field_name+'-autosuggest-progress').show();
        },
        open: function( event, ui ) {
            // Hide progress icon
            $('#'+field_name+'-autosuggest-progress').hide('fade',{ },200);
            // If user backspaces to remove all search characters, then make sure the auto-suggest list stays hidden (buggy)
            if ($('input#'+field_name+'-autosuggest').val().length == 0) {
                $('.ui-autocomplete, .ui-menu-item').hide();
            }
        },
        focus: function( event, ui ) {
            // Prevent it from putting the value in the search input (default)
            return false;
        },
        select: function( event, ui ) {
            // Add raw value to original input field
            $('input[name="'+field_name+'"]').val(ui.item.value);
            // Put the label into the span
            $('#'+field_name+'-autosuggest-span').val(ui.item.preflabel);
            // Trigger blur on search input to force it to hide
            $('input#'+field_name+'-autosuggest').trigger('blur');
            // Make ajax call to store the label
            if (page != 'Design/online_designer.php') {
                $.post(url_cache, { service: ui.item.service, category: ui.item.cat, value: ui.item.value, label: ui.item.preflabel });
            }
            // Execute branching and calculations, just in case
            try{ calculate(field_name);doBranching(field_name); }catch(e){ }
            return false;
        }
    })
        .data('ui-autocomplete')._renderItem = function( ul, item ) {
        return $("<li></li>")
            .data("item", item)
            .append("<a>"+item.label+"</a>")
            .appendTo(ul);
    };
    // When user clicks or focuses on original input, put cursor in the search box
    $('#'+field_name+'-autosuggest-span, input[name="'+field_name+'"]').bind('click focus', function(){
        var current_val = $('#'+field_name+'-autosuggest-span').val();
        // Temporarily hide original input and display search input
        $('input[name="'+field_name+'"]').hide();
        $('#'+field_name+'-autosuggest-span').hide();
        $('input#'+field_name+'-autosuggest').val(current_val).show().focus();
        $('#'+field_name+'-autosuggest-instr').show();
    });
    // Re-display original input after choosing selection or leaving search field
    $('input#'+field_name+'-autosuggest').bind('blur', function(){
        $(this).hide();
        $('#'+field_name+'-autosuggest-instr, #'+field_name+'-autosuggest-progress').hide();
        $('input[name="'+field_name+'"], #'+field_name+'-autosuggest-span').show();
        // If auto-suggest value was removed or is empty, make sure the other inputs are empty as well so that it gets erased if already saved.
        if ($(this).val().length == 0) {
            $('#'+field_name+'-autosuggest-span').val('');
            $('input[name="'+field_name+'"]').val('');
            // Execute branching and calculations, just in case
            try{ calculate(field_name);doBranching(field_name); }catch(e){ }
        }
    });
}

// Open dialog with embedded video
function openEmbedVideoDlg(video_url,unknown_video_service,field_name) {
    var dlgid = 'rc-embed-video-dlg_'+field_name;
    var vidid = 'rc-embed-video_'+field_name;
    var vidwidth = 750;
    var vidheight = 500;
    if (unknown_video_service) {
        var rc_embed_html = '<embed id="'+vidid+'" src="'+video_url+'" width="'+vidwidth+'" height="'+vidheight+'" scale="aspect" controller="true" autostart="0" autostart="false"></embed>';
    } else {
        var rc_embed_html = '<iframe id="'+vidid+'" src="'+video_url+'" type="text/html" frameborder="0" allowfullscreen width="'+vidwidth+'" height="'+vidheight+'"></iframe>';
    }
    // Add content to dialog and open it
    initDialog(dlgid);
    $('#'+dlgid)
        .show().html(rc_embed_html)
        .dialog({ height: (vidheight+130), width: (isMobileDevice ? $(window).width() : (vidwidth+60)), open:function(){ fitDialog(this); }, close:function(){ $(this).dialog('destroy'); $('#'+dlgid).remove(); },
            buttons: [{ text: "Close", click: function(){ $(this).dialog('close'); } }], title: 'Video', bgiframe: true, modal: true
        });
    // Mobile only: Resize video
    if (isMobileDevice) {
        $('#'+vidid).width( $('body').width()-40 );
        $('#'+vidid).height( $('#'+dlgid).height()-10 );
    }
}

// Add or remove a password mask from a text input field
// Object "ob" should be passed to the function as the jQuery object of the input field.
// Boolean "add", in which false=remove password mask.
function passwordMask(ob, add) {
    // Remove any date/time picker widgets from input
    try { ob.datepicker('destroy'); }catch(e){ }
    try { ob.datetimepicker('destroy'); }catch(e){ }
    try { ob.timepicker('destroy'); }catch(e){ }
    ob.removeClass('hasDatepicker').unbind();
    // Clone input field and replace it
    ob.clone().attr('type', (add ? 'text' : 'password')).insertAfter(ob);
    ob.remove();
    // Reactivate any widgets whose connection to object gets lost with cloning
    initWidgets();
}

// Matrix field ranking validation function
function matrix_rank(crnt_val,crnt_var,grid_vars) {
    // Reset validation flag on page
    $('#field_validation_error_state').val('0');
    // array of all field_names within matrix group
    // gv[0]=>'w1',gv[1]=>'w2',gv[2]=>'w3',...
    var grid_vars = grid_vars.split(',');
    var id, i;
    var rank_remove_label = $('#matrix_rank_remove_label');
    var remove_label_time = 2500;
    // loop through other variables within this matrix group
    for (i = 0; i < grid_vars.length; i++) {
        if (crnt_var !== grid_vars[i]) {
            id = "mtxopt-"+grid_vars[i]+"_"+crnt_val;
            id = id.replace(/\./g,'\\.');
            if ($("#"+id).is(":checked")) {
                // Uncheck the input
                radioResetVal(grid_vars[i],'form');
                // Add temporary "value removed" label
                rank_remove_label.show().position({
                    my:        "center top",
                    at:        "center top+10",
                    of:        $("#"+id)
                });
                setTimeout(function(){
                    rank_remove_label.hide();
                },remove_label_time);
            }
        }
    }
}

// When stop action is triggered by clicking a survey question option, give notice before ending survey
function triggerStopAction(ob) {
    var obname = ob.prop('name');
    // Get varname of field
    var varname = '';
    if (obname.substring(0,8) == '__chkn__'){
        // Checkbox
        varname = obname.substring(8,obname.length);
    } else if (obname.substring(obname.length-8,obname.length) == '___radio'){
        // Radio
        varname = obname.substring(0,obname.length-8);
    } else {
        // Drop-down (including any auto-complete input component)
        varname = obname;
    }
    $('#stopActionPrompt').dialog({ bgiframe: true, modal: true, width: (isMobileDevice ? $(window).width() : 550),
        close: function(){
            // Undo last response if closing and returning to survey
            if (obname.substring(0,8) == '__chkn__'){
                // Checkbox
                $('#form :input[name="'+obname+'"]').each(function(){
                    if ($(this).attr('code') == ob.attr('code')) {
                        $(this).prop('checked',false);
                        // If using Enhanced Choices for radios, then deselect it
                        $('#'+varname+'-tr div.enhancedchoice label.selectedchkbox[comps="'+varname+',code,'+ob.attr('code')+'"]').removeClass('selectedchkbox').addClass('unselectedchkbox');
                    }
                });
                $('#form :input[name="'+obname.replace('__chkn__','__chk__')+'_RC_'+replaceDotInCheckboxCoding(ob.attr('code'))+'"]').val('');
            } else if (obname.substring(obname.length-8,obname.length) == '___radio'){
                // Radio
                radioResetVal(varname,'form');
            } else {
                // Drop-down (including any auto-complete input component)
                $('#form select[name="'+obname+'"], #rc-ac-input_'+obname).val('');
            }
            // Highlight the row they need to return to
            setTimeout(function(){
                $('#stopActionReturn').dialog({ bgiframe: true, modal: true, width: 320,
                    buttons: [{ text: stopAction3, click: function() {
                            highlightTableRow(varname+'-tr',2500); $(this).dialog('close');
                        } } ]
                });
            },100);
        },
        buttons: [{ text: stopAction2, click: function() {
                // Trigger calculations and branching logic
                setTimeout(function(){calculate(varname);doBranching(varname);},50);
                $(this).dialog('close');
            } },
            { text: stopAction1, click: function() {
                    // Make sure that auto-complete drop-downs get their value set prior to ending survey
                    if ($('#form select[name="'+obname+'"]').hasClass('rc-autocomplete') && $('#rc-ac-input_'+obname).length) {
                        $('#rc-ac-input_'+obname).trigger('blur');
                    }
                    // Change form action URL to force it to end the survey
                    $('#form').prop('action', $('#form').prop('action')+'&__endsurvey=1' );
                    // Submit the survey
                    dataEntrySubmit(document.getElementById('submit-action'));
                } } ]
    });
}

//Set value and enable specific slider
function setSlider(fld,val,enable) {
    $("#slider-"+fld).slider("option", "value", val);
    $("#slider-"+fld).slider("enable");
    $("#sldrmsg-"+fld).css('visibility','hidden');
}

//Reset slider value
function resetSlider(fld) {
    $("#slider-"+fld).slider("option", "value", 50);
    $("#slider-"+fld).slider("disable");
    $("#sldrmsg-"+fld).css('visibility','visible');
    $('form[name="form"] input[name="'+fld+'"]').val('');
    dataEntryFormValuesChanged = true;
    $('#slider-'+fld).removeAttr('modified');
    calculate(fld);
    doBranching(fld);
    try {
        $('.piping_receiver.piperec-'+event_id+'-'+fld).html(missing_data_replacement_js );
        $('.piping_receiver.piperec-'+event_id+'-'+fld+'-value').html(missing_data_replacement_js );
        $('.piping_receiver.piperec-'+event_id+'-'+fld+'-label').html(missing_data_replacement_js );
    } catch(e) { }
}

//Date field functions
function dateKeyDown(event2,fldname) {
    // eval("var fld = document.form."+fldname+";");
    if (event2.keyCode==13) {
        $('document.form.'+fldname).blur();
        return true;
    }
}

// Button to set date field to today's date
function setToday(name,valType) {
    eval("document.form."+name+".value='"+getCurrentDate(valType)+"';");
    // If user modifies any values on the data entry form, set flag to TRUE
    dataEntryFormValuesChanged = true;
    // Trigger branching/calc fields, in case fields affected
    $('[name='+name+']').focus();
    setTimeout(function(){try{calculate(name);doBranching(name);}catch(e){}},50);
}

// Button to set time field to current time as hh:ss
function setNowTime(name) {
    eval("document.form."+name+".value='"+currentTime('both')+"';");
    // If user modifies any values on the data entry form, set flag to TRUE
    dataEntryFormValuesChanged = true;
    // Trigger branching/calc fields, in case fields affected
    $('[name='+name+']').focus();
    setTimeout(function(){try{calculate(name);doBranching(name);}catch(e){}},50);
}

// Button to set datetime field to current time as yyyy-mm-dd hh:ss
function setNowDateTime(name,showSeconds,valType) {
    eval("document.form."+name+".value='"+getCurrentDate(valType)+' '+currentTime('both',showSeconds)+"';");
    // If user modifies any values on the data entry form, set flag to TRUE
    dataEntryFormValuesChanged = true;
    // Trigger branching/calc fields, in case fields affected
    $('[name='+name+']').focus();
    setTimeout(function(){try{calculate(name);doBranching(name);}catch(e){}},50);
}

// Get today's date in various formats
function getCurrentDate(valType,returnUTC) {
    if (typeof returnUTC == 'undefined') returnUTC = false;
    var d = new Date();
    if (returnUTC) {
        d.toUTCString();
        d = new Date( d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds() );
    }
    var month = d.getMonth() + 1;
    if (month < 10) month = "0" + month;
    var day = d.getDate();
    if (day < 10) day = "0" + day;
    var year = d.getFullYear();
    if (/_mdy/.test(valType)) {
        return month+'-'+day+'-'+year;
    } else if (/_dmy/.test(valType)) {
        return day+'-'+month+'-'+year;
    } else {
        return year+'-'+month+'-'+day;
    }
}

// Open popup window for viewing a calc field's equation
function viewEq(field, isDataCalc, isCalcText) {
    var metadata_table = (status > 0 && page == 'Design/online_designer.php') ? 'metadata_temp' : 'metadata';
    $.get(app_path_webroot+'DataEntry/view_equation_popup.php', { pid: pid, field: field, metadata_table: metadata_table, calcdate: isDataCalc, calctext: isCalcText }, function(data) {
        if (!$('#viewEq').length) $('body').append('<div id="viewEq"></div>');
        $('#viewEq').html(data);
        $('#viewEq').dialog({ bgiframe: true, modal: true, title: 'Calculation equation for variable "'+field+'"', width: 600,
            buttons: { Close: function() { $(this).dialog('close'); } }, open:function(){ fitDialog(this); } });
    });
}

// Branching Logic & Calculated Fields
var calcErrExist = true;
var brErrExist   = true;
function calcErr(fld) {
    alert('CALCULATION ERRORS EXIST!\n\nThere is a syntactical error in the calculation for the field "'+fld+'" on this page. '
        + 'None of the calculations on this data entry form will function correctly until this error has been corrected.\n\n'
        + 'If you are not sure what this means, please contact your project administrator.');
}
function calcErr2() {
    alert('CALCULATION ERRORS EXIST!\n\nThere is a syntactical error in one or more of the calculations on this page. '
        + 'It cannot be determined which fields contain the error, so please check the equation for every calculated field on this page. '
        + 'None of the calculations on this data entry form will function correctly until this error has been corrected.\n\n'
        + 'If you are not sure what this means, please contact your project administrator.');
}
function brErr(fld) {
    if (page == 'surveys/index.php') {
        // Survey page
        alert('SURVEY ERRORS EXIST: CANNOT CONTINUE!\n\nPlease contact your survey administrator and let them know that Branching Logic errors exist on this survey for the field "'+fld+'". This survey will not function correctly until these errors have been fixed. Sorry for any inconvenience.');
    } else {
        // Data entry form
        alert('BRANCHING LOGIC ERRORS EXIST!\n\nThere is a syntactical error in the Branching Logic for the field "'+fld+'" on this page. '
            + 'None of the Branching Logic on this data entry form will function correctly until this error has been corrected.\n\n'
            + 'If you are not sure what this means, please contact your project administrator.');
    }
}
function brErase(fld) {
    return 'ERASE CURRENT VALUE OF THE FIELD "'+fld+'" ?\n\n'
        + 'The current field for which you just entered data requires that the field named "'+fld+'" be hidden from view. '
        + 'However, that field already has a value, so its value might need to be reset back to a blank value.\n\n'
        + 'Click OK to HIDE this field and ERASE its current value. Click CANCEL if you DO NOT wish to hide this field or erase its current value.';
}
function brErr2() {
    if (page == 'surveys/index.php') {
        // Survey page
        alert('SURVEY ERRORS EXIST: CANNOT CONTINUE!\n\nPlease contact your survey administrator and let them know that Branching Logic errors exist on this survey. This survey will not function correctly until these errors have been fixed. Sorry for any inconvenience.');
    } else {
        // Data entry form
        alert('BRANCHING LOGIC ERRORS EXIST!\n\nThere is a syntactical error in the Branching Logic of one or more fields on this page. '
            + 'It cannot be determined which fields contain the error, so please check the Branching Logic for every field on this page. '
            + 'None of the Branching Logic on this data entry form will function correctly until this error has been corrected.\n\n'
            + 'If you are not sure what this means, please contact your project administrator.');
    }
}

// Remove all unselected options from Form Status drop-down (used when page is locked but not e-signed)
function removeUnselectedFormStatusOptions() {
    $(':input[name='+getParameterByName('page')+'_complete] option').each(function(){
        if ( $(this).prop('selected') == false ) {
            $(this).remove();
        } else {
            $(this).css('color','gray');
        }
    });
}

// Run processes when submitting form on data entry page
function formSubmitDataEntry() {
    // Disable the onbeforeunload so that we don't get an alert before we leave
    window.onbeforeunload = function() { }
    // Disable all buttons on page when submitting to prevent double submission
    $('#form :button, #formSaveTip :button').prop('disabled',true);
    // Before finally submitting the form, execute all calculated fields again just in case someone clicked Enter in a text field
    calculate();
    // Is survey page?
    var isSurveyPage = (page == 'surveys/index.php');
    // REQUIRED FIELDS: Loop through table and remove form elements from html that are hidden due to branching logic
    // (so user is not prompted to enter values for invisible fields).
    $("#questiontable tr").each(function() {
        // Is it a required field (and is not embedded)?
        if ($(this).attr("req") != null && !$(this).hasClass('row-field-embedded')) {
            // Is the req field hidden (i.e. on another survey page)?
            if ($(this).css("display") == "none") {
                // Only remove field from form if does not already have a saved value (i.e. has 'hasval=1' as row attribute)
                if ($(this).attr("hasval") != "1" && !($(this).hasClass("\@HIDDEN")
                    || ($(this).hasClass("\@HIDDEN-SURVEY") && isSurveyPage) || ($(this).hasClass("\@HIDDEN-FORM") && !isSurveyPage)))
                {
                    $(this).html('');
                    // Add to empty required field list that gets submitted
                    appendHiddenInputToForm('empty-required-field[]', $(this).attr("sq_id"));
                }
            }
        }
    });
    $("#questiontable .rc-field-embed[req='1']").each(function() {
        // Is the req field hidden (i.e. on another survey page)? But not hidden via @HIDDEN.
        var parent_tr = $(this).parentsUntil('tr[sq_id]').parent();
        if ((parent_tr.css("display") == "none" && !parent_tr.hasClass("\@HIDDEN") && !parent_tr.hasClass("\@HIDDEN-SURVEY") && !parent_tr.hasClass("\@HIDDEN-FORM")) || $(this).css("display") == "none") {
            // Only remove field from form if does not already have a saved value (i.e. has 'hasval=1' as row attribute)
            $(this).html('');
            // Add to empty required field list that gets submitted
            appendHiddenInputToForm('empty-required-field[]', $(this).attr("var"));
        }
    });
    // For surveys only
    if (isSurveyPage) {
        // If using "save and return later", append to form action to point to new place
        if ($('#submit-action').val() == "submit-btn-savereturnlater") {
            $('#form').attr('action', $('#form').attr('action')+'&__return=1' );
        }
        // If using "previous page" button, append to form action to point to new place
        if ($('#submit-action').val() == "submit-btn-saveprevpage") {
            $('#form').attr('action', $('#form').attr('action')+'&__prevpage=1' );
        }
    }
    // Re-enable any disabled fields (due to field action tags and such) - make sure we leave any randomization fields disabled though
    $('#questiontable input:disabled, #questiontable select:disabled, #questiontable textarea:disabled').each(function(){
        var fld = $(this);
        // if (randomizationCriteriaFieldList == null || !in_array(fld.parents('tr:first').attr('id').slice(0,-3), randomizationCriteriaFieldList)) {
        if (randomizationCriteriaFieldList == null ||
            (typeof fld.parents('tr:first').attr('id') != 'undefined' && !in_array(fld.parents('tr:first').attr('id').slice(0,-3), randomizationCriteriaFieldList))
        ) {
            fld.prop('disabled', false);
        }
    });
    // If Secondary Unique Field is disabled (because it's currently being checked for uniqueness via AJAX), then don't submit form
    if (secondary_pk != '' && $('#form :input[name="'+secondary_pk+'"]').length && $('#form :input[name="'+secondary_pk+'"]').prop('disabled')) {
        // Re-enable all submit buttons
        $('#form :button, #formSaveTip :button').prop('disabled',false);
        // Do not submit form
        return;
    }
    // Submit form (finally!)
    document.form.submit();
}

// Execute when buttons are clicked on data entry forms
function dataEntrySubmit(ob)
{
    // Set value of hidden field used in post-processing after form is submitted
    if (typeof ob === 'string' || ob instanceof String) {
        $('#submit-action').val( ob );
    } else {
        $('#submit-action').val( $(ob).attr('name') );
    }
    if ($('#submit-action').val() == '' || $('#submit-action').val() == null) {
        $('#submit-action').val('submit-btn-saverecord');
    }

    // Clicked Save or Delete
    if ($('#submit-action').val() != "submit-btn-cancel")
    {
        // Determine esign_action
        var esign_action = "";
        if ($('#__ESIGNATURE__').length && $('#__ESIGNATURE__').prop('checked') && $('#__ESIGNATURE__').prop('disabled') == false) {
            esign_action = "save";
            // If form is not locked already or checked to be locked, then stop (because is necessary)
            if ($('#__LOCKRECORD__').prop('checked') == false) {
                simpleDialog('WARNING:\n\nThe "Lock Record" option must be checked before the e-signature can be saved. Please check the "Lock Record" check box and try again.');
                return false;
            }
        }

        // Set the lock action
        var lock_action = ($('#__LOCKRECORD__').prop("disabled") && (esign_action == "save" || esign_action == "")) ? 2 : 1;

        // "change reason" popup for existing records (and lock record, if user has rights)
        if (require_change_reason && record_exists && (dataEntryFormValuesChanged || $('#submit-action').val() == 'submit-btn-delete'))
        {
            $('#change_reason_popup').dialog({ bgiframe: true, modal: true, width: 500, zIndex: 4999, buttons: {
                    'Save': function() {
                        $('#change_reason_popup_error').css('display','none'); //Default state
                        if ($("#change_reason").val().length < 1) {
                            $('#change_reason_popup_error').toggle('blind',{},'normal');
                            return false;
                        }
                        // Before submitting the form, add change reason values from dialog as form elements for submission
                        $('#form').append('<input type="hidden" name="change-reason" value="'+$("#change_reason").val().replace(/"/gi, '&quot;')+'">');
                        // Save locked value
                        if ($('#__LOCKRECORD__').prop('checked')) {
                            $('#change_reason_popup').dialog('destroy');
                            saveLocking(lock_action,esign_action);
                            // Not locked, so just submit form
                        } else {
                            formSubmitDataEntry();
                        }
                    }
                } });
        }
        // Do locking and/or save e-signature, then submit form
        else if ($('#__LOCKRECORD__').prop('checked') && (!$('#__LOCKRECORD__').prop("disabled") || esign_action == "save"))
        {
            saveLocking(lock_action,esign_action);
        }
        // Just submit form if neither using change_reason nor locking
        else
        {
            formSubmitDataEntry();
        }
    }
    // Clicked Cancel (requires form submission)
    else {
        formSubmitDataEntry();
    }
}

// After running branching logic, hide any section headers in which all fields in the section have been hidden
function hideSectionHeaders() {
    var this_id;
    var this_display;
    var lastSH = "";
    var numFields = 0;
    var numFieldsHidden = 0;
    var tbl = document.getElementById("questiontable");
    var rows = tbl.tBodies[0].rows; //getElementsByTagName("tr")
    var matrixGroup = "";
    var lastMatrixGroup = "";
    var matrixGroups = new Array();
    var fieldIsHidden;
    var getClassTerm = 'class';
    var thisClass;
    var isSurveyPage = (page == 'surveys/index.php');
    //Get index somewhere in middle of table
    for (var i=0; i<rows.length; i++) {
        // Get id for this row
        this_id = rows[i].getAttribute("id");

        // If this row has an id, then check if SH, matrix header, matrix field, or regular field
        if (this_id != null && this_id.indexOf("-tr") > 0) {

            // If a Section Header, then check if previous section's fields were all hidden. If so, then hide the SH too.
            if (this_id.indexOf("-sh-tr") > 0) {
                if (lastSH != "") {
                    if (numFieldsHidden == numFields && numFields > 0) {
                        // Hide SH
                        document.getElementById(lastSH).style.display = 'none';
                    } else {
                        // Possibly show SH OR do nothing
                        var showit = true;
                        if (isSurveyPage) {
                            // Survey page: Treat differently since it contains fields on the form that might need to remain hidden (because of multi-paging)
                            if (document.getElementById(lastSH).getAttribute(getClassTerm) != null) {
                                if (document.getElementById(lastSH).getAttribute(getClassTerm).indexOf('hidden') > -1) {
                                    // If row has class 'hidden', then keep hidden
                                    showit = false;
                                }
                            }
                        }
                        // Make SH visible (in case it was hidden)
                        if (showit) document.getElementById(lastSH).style.display = (isIE && IEv<10 ? 'block' : 'table-row');
                    }
                }
                // Reset values for next section
                lastSH = this_id;
                numFields = 0;
                numFieldsHidden = 0;
                matrixGroup = "";
            }

            // If a Matrix Header, then hide the Matrix Header too.
            else if (this_id.indexOf("-mtxhdr-tr") > 0) {
                matrixGroup = lastMatrixGroup = document.getElementById(this_id).getAttribute('mtxgrp');
                matrixGroups[matrixGroup] = 0;
            }

            // If a normal field, then check its display value AND if it's in a matrix group
            else {
                // Check if hidden
                fieldIsHidden = (document.getElementById(this_id).style.display == "none"
                                || (document.getElementById(this_id).getAttribute(getClassTerm) != null && document.getElementById(this_id).getAttribute(getClassTerm).indexOf('hide') > -1));
                if (!fieldIsHidden) {
                    // Also check if has @HIDDEN action tag
                    if (document.getElementById(this_id).getAttribute(getClassTerm) != null) {
                        thisClass = document.getElementById(this_id).getAttribute(getClassTerm);
                        if (thisClass.indexOf('@HIDDEN ') > -1 || thisClass.substr(thisClass.length-7) == '@HIDDEN'
                            || (isSurveyPage && thisClass.indexOf('@HIDDEN-SURVEY') > -1)
                            || (!isSurveyPage && thisClass.indexOf('@HIDDEN-FORM') > -1))
                        {
                            // Set as hidden
                            fieldIsHidden = true;
                            document.getElementById(this_id).style.display == "none";
                        }
                    }
                }
                if (fieldIsHidden) numFieldsHidden++;
                // Count field for this section
                numFields++;
                // If field is in a matrix group, get group name
                if (document.getElementById(this_id).getAttribute('mtxgrp') != null) {
                    matrixGroup = document.getElementById(this_id).getAttribute('mtxgrp');
                    if (!fieldIsHidden) matrixGroups[matrixGroup]++;
                }
            }

        }
    }

    // For survey pages only: Check if we need to hide the last SH on the page (will not hide by itself with current logic)
    if (isSurveyPage && lastSH != "") {
        if (numFieldsHidden == numFields && numFields > 0) {
            // Hide SH
            document.getElementById(lastSH).style.display = 'none';
        } else {
            // Possibly show SH OR do nothing
            var showit = true;
            if (isSurveyPage) {
                // Survey page: Treat differently since it contains fields on the form that might need to remain hidden (because of multi-paging)
                if (document.getElementById(lastSH).getAttribute(getClassTerm) != null) {
                    if (document.getElementById(lastSH).getAttribute(getClassTerm).indexOf('hidden') > -1) {
                        // If row has class 'hidden', then keep hidden
                        showit = false;
                    }
                }
            }
            // Make SH visible (in case it was hidden)
            if (showit) document.getElementById(lastSH).style.display = (isIE && IEv<10 ? 'block' : 'table-row');
        }
    }

    // If any matrix groups have all their fields hidden (i.e. value=0), then hide the matrix header
    for (var grpname in matrixGroups) {
        var mtxhdr_id = grpname+'-mtxhdr-tr';
        if (matrixGroups[grpname] == 0) {
            // Hide matrix header
            document.getElementById(mtxhdr_id).style.display = 'none';
        } else {
            // Possibly show matrix header OR do nothing
            var showit = true;
            if (isSurveyPage) {
                // Survey page: Treat differently since it contains fields on the form that might need to remain hidden (because of multi-paging)
                if (document.getElementById(mtxhdr_id).getAttribute(getClassTerm) != null) {
                    if (document.getElementById(mtxhdr_id).getAttribute(getClassTerm).indexOf('hidden') > -1) {
                        // If row has class 'hidden', then keep hidden
                        showit = false;
                    }
                }
            }
            // Make matrix header visible (in case it was hidden)
            if (showit) document.getElementById(mtxhdr_id).style.display = (isIE && IEv<10 ? 'block' : 'table-row');
        }
    }
}

function uploadFilePreProcess() {
    $('#file_upload_vault_popup_error').hide();
    var isSignature = ($('#f1_upload_form input[name="myfile_base64"]').val().length > 0);
    var missingFile = (!isSignature && $('#f1_upload_form input[name="myfile"]').val().length + $('#f1_upload_form input[name="myfile_base64"]').val().length == 0);
    var isSurvey = (page == 'surveys/index.php');
    if (isSignature || missingFile || !file_upload_vault_enabled) {
        // Normal: Submit the form
        $('#form_file_upload').submit();
        return;
    }
    $('#file_upload_vault_popup_text1').html(basename($('#f1_upload_form input[name="myfile"]').val()));
    // Prompt for user password for Vault Storage+Password feature (excluding surveys)
    if (isSurvey) {
        // Survey
        simpleDialog(null, null,'file_upload_vault_popup', 550,null,lang_cancel, "$('#form_file_upload').submit();",lang_confirm);
    } else {
        // Form: Password prompt
        simpleDialog(null,null,'file_upload_vault_popup',600,null,lang_cancel,function(){
            // Verify username/password
            $('#file_upload_vault_password').val( $('#file_upload_vault_password').val().trim() );
            $.post(app_path_webroot+'index.php?pid='+pid+'&route=DataEntryController:passwordVerify',{username: $('#file_upload_vault_username').val(), password: $('#file_upload_vault_password').val()},function(data){
                if (data == '1') {
                    $('#file_upload_vault_password').val('');
                    $('#form_file_upload').submit();
                } else if (data == '0') {
                    simpleDialog('ERROR: The username or password that you entered is incorrect! Please try again.','ERROR',null,400,'uploadFilePreProcess();');
                } else {
                    alert(woops);
                    uploadFilePreProcess();
                }
            });
        },lang_confirm);
    }
    $('#file_upload_vault_popup').parent().find('div.ui-dialog-buttonpane button:eq(1)').css('color','#006000').addClass('font-weight-bold').prepend('<i class="fas fa-check"></i> ');
    $('#file_upload_vault_password').focus();
}

var file_upload_delete_reason = '';
function deleteDocumentConfirm(doc_id,this_field,id,event_id,instance,delete_page,version,version_hash) {
    if (typeof version == 'undefined') version = '';
    if (typeof version_hash == 'undefined') version_hash = '';
    var extraText = '';
    if (file_upload_vault_enabled) {
        file_upload_delete_reason = '';
        extraText = '<div class="mt-3 mb-2">Provide reason for deleting this file (reason will be logged):<textarea id="file_upload_delete_reason" class="x-form-field notesbox" style="height:60px;" onchange="file_upload_delete_reason=this.value;"></textarea></div>';
    }
    simpleDialog("<div class='boldish fs14'>Are you sure you want to permanently remove this file?</div>"+extraText,"Delete file?",null,480,"$('#MDMenu').hide();","Cancel",function(){
        if ($('#file_upload_delete_reason').length) {
            $('#file_upload_delete_reason').val($('#file_upload_delete_reason').val().trim());
            if ($('#file_upload_delete_reason').val() == '') {
                simpleDialog("You MUST provide a reason for deleting this file. Please try again.", "ERROR", null, null,
                    "deleteDocumentConfirm('" + doc_id + "','" + this_field + "','" + id + "','" + event_id + "','" + instance + "','" + delete_page + "','" + version + "','" + version_hash + "');"
                );
                return;
            }
        }
        deleteDocument(doc_id,this_field,id,event_id,instance,delete_page,version,version_hash);
    },"Yes, delete it");
}
var codeUpdateAfterDeleteFile = "";
function deleteDocument(doc_id,this_field,id,event_id,instance,delete_page,version,version_hash) {
    // Set value to blank on form
    if (version == '') {
        eval("document.form." + this_field + ".value = '';");
    }
    var data = { s: getParameterByName('s'), id: doc_id, field_name: this_field, record: id, event_id: event_id, instance: instance,
        doc_version: version, doc_version_hash: version_hash };
    $.post(delete_page+'&'+$.param(data),{ file_upload_delete_reason: file_upload_delete_reason },function(data) {
        // Set value to blank on form
        if (version == '') {
            $("#" + this_field + "-linknew").html(data);
            $("#" + this_field + "-link").hide();
            $('#' + this_field + '-sigimg').hide();
            dataEntryFormValuesChanged = true;
        }
        // Display confirmation dialog
        var file_delete_dialog_id = 'file_delete_dialog';
        initDialog(file_delete_dialog_id);
        if (version == '') {
            $('#' + file_delete_dialog_id).html('The file "<b>' + $("#" + this_field + "-link").html() + '</b>" has been deleted.');
        } else {
            $('#' + file_delete_dialog_id).html('Version '+version+' of the file has been deleted.');
        }
        simpleDialog(null,"File deleted",file_delete_dialog_id);
        // Close dialog automatically with fade effect
        setTimeout(function(){
            if ($('#'+file_delete_dialog_id).hasClass('ui-dialog-content')) $('#'+file_delete_dialog_id).dialog('option', 'hide', {effect:'fade', duration: 500}).dialog('close');
            if ($('#data_history').hasClass('ui-dialog-content')) $('#data_history').dialog('destroy');
            // Destroy the dialog so that fade effect doesn't persist if reopened
            setTimeout(function(){
                if ($('#'+file_delete_dialog_id).hasClass('ui-dialog-content')) $('#'+file_delete_dialog_id).dialog('destroy');
                if (version != '') dataHist(this_field,event_id,lastDataHistWidth);
            },500);
        },2200);
        // If clicked a Missing Data Code, which deleted the file, then
        if (codeUpdateAfterDeleteFile != '' && $('#MDMenu div[code="'+codeUpdateAfterDeleteFile+'"]').length) {
            $('#MDMenu div[code="'+codeUpdateAfterDeleteFile+'"]').trigger('click');
        } else {
            $('#MDMenu').hide();
        }
        codeUpdateAfterDeleteFile = '';
    });
    // Trigger branching logic in case a "file" field is involved in branching
    doBranching(this_field);
    return true;
}

function stopUpload(success,this_field,doc_id,doc_name,study_id,doc_size,event_id,download_page,delete_page,doc_id_hash,instance){
    var result = '';
    if (success == 1){
        try {
            if (typeof window.parent.lang_remove_file != 'undefined') {
                var lang_remove_file = window.parent.lang_remove_file;
                var lang_send_it = window.parent.lang_send_it;
                var lang_upload_new_version = window.parent.lang_upload_new_version;
            }
        } catch (e) { }
        if (typeof lang_remove_file == 'undefined') {
            var lang_remove_file = 'Remove file';
            var lang_send_it = 'Send-It';
            var lang_upload_new_version = 'Upload new version';
        }
        var sigimg = $('#'+this_field+'-sigimg');
        result = '<div style="font-weight:bold;font-size:14px;text-align:center;color:green;"><br><i class="fas fa-check"></i> File was successfully uploaded!<\/div>';
        document.getElementById(this_field+"-link").style.display = 'block';
        doc_name = truncate_filename(doc_name, 34);
        document.getElementById(this_field+"-link").innerHTML = doc_name+doc_size;
        document.getElementById(this_field+"-link").href = download_page+"&doc_id_hash="+doc_id_hash+"&id="+doc_id+"&s="+getParameterByName('s')+"&record="+study_id+"&page="+getParameterByName('page')+"&event_id="+event_id+"&field_name="+this_field+"&instance="+instance;
        $('#'+this_field+"-link").attr('onclick', "return appendRespHash('"+this_field+"');");
        var newlinktext = '<a href="javascript:;" class="deletedoc-lnk" style="font-size:10px;color:#C00000;" onclick=\'deleteDocumentConfirm('+doc_id+',"'+this_field+'","'+study_id+'",'+event_id+','+instance+',"'+delete_page+'&__response_hash__="+$("#form :input[name=__response_hash__]").val());return false;\'><i class="far fa-trash-alt mr-1"></i>'+lang_remove_file+'</a>';
        if (sendit_enabled) {
            newlinktext += "<span class=\"sendit-lnk\"><span style=\"font-size:10px;padding:0 10px;\">or</span><a onclick=\"simpleDialog('In order to use Send-It with this file, the current web page must first be saved by clicking the button at the bottom of the page.','NOTICE');return false;\" href=\"javascript:;\" style=\"font-size:10px;\"><i class=\"far fa-envelope mr-1\"></i>"+lang_send_it+"</a>&nbsp;</span>";
        }
        if (file_upload_versioning_enabled && !sigimg.length) {
            newlinktext = '<a href="javascript:;" style="font-size:10px !important;color:green;" class="fileuploadlink" '
                + 'onclick="filePopUp(\''+this_field+'\',0,1);return false;"><i class="fas fa-upload mr-1"></i>'+lang_upload_new_version+'</a>'
                + '<span style="font-size:10px;padding:0 10px;">or</span>' + newlinktext;
        }
        document.getElementById(this_field+"-linknew").innerHTML = newlinktext;
        eval("document.form."+this_field+".value = '"+doc_id+"';");
        // If a signature field, then add inline image
        if (sigimg.length) {
            sigimg.show().html('<img src="'+download_page.replace('file_download.php','image_view.php')+"&doc_id_hash="+doc_id_hash+"&id="+doc_id+"&s="+getParameterByName('s')+"&record="+study_id+"&page="+getParameterByName('page')+"&event_id="+event_id+"&instance="+instance+"&field_name="+this_field+'&signature=1" alt="Signature">');
        }
    } else {
        result = '<div style="font-weight:bold;color:#C00000;margin-top:15px;font-size:14px;text-align:center;">There was an error during file upload!<\/div>';
    }
    document.getElementById('f1_upload_form').style.display = 'block';
    document.getElementById('f1_upload_form').innerHTML = result;
    document.getElementById('f1_upload_process').style.display = 'none';
    // Close dialog automatically with fade effect
    if ($("#file_upload").hasClass('ui-dialog-content')) {
        if (success == 1) {
            // If this is a signature field, then close dialog immediately
            if ($('#'+this_field+'-sigimg').length) {
                $('#file_upload').dialog('destroy');
                if (inIframe()) {
                    var urlparts = window.location.href.split('#');
                    window.location.href = urlparts[0]+'#'+this_field+'-tr';
                }
            } else {
                $('#file_upload').dialog('option', 'buttons', { "Close": function() { $(this).dialog("destroy"); } });
                setTimeout(function(){
                    if ($("#file_upload").hasClass('ui-dialog-content')) $('#file_upload').dialog('option', 'hide', {effect:'fade', duration: 200}).dialog('close');
                    // Destroy the dialog so that fade effect doesn't persist if reopened
                    setTimeout(function(){
                        if ($("#file_upload").hasClass('ui-dialog-content')) $('#file_upload').dialog('destroy');
                    },200);
                    if (inIframe()) {
                        var urlparts = window.location.href.split('#');
                        window.location.href = urlparts[0]+'#'+this_field+'-tr';
                    }
                },1500);
            }
        } else {
            $('#file_upload').dialog('option', 'buttons', { "Close": function() { $(this).dialog("destroy"); },
                "Try again": function() { $('#file_upload').dialog('destroy'); $('#'+this_field+'-linknew a.fileuploadlink').trigger('click'); } });
        }
    }
    // Trigger branching logic in case a "file" field is involved in branching
    calculate(this_field);
    doBranching(this_field);
    return true;
}

// Obtain the base64 data from a signature File Upload field
function saveSignature() {
    // Make sure we have a signature first (bypass this for IE8 and lower or iOS 6 and lower because of some strange issue)
    if ($('#f1_upload_form input[name="myfile_base64_edited"]').val() == '0' && !((isIOS && iOSv <= 6))) {
        simpleDialog("You must first sign your signature","ERROR",null,300);
        return false;
    }
    $('#signature-div, #signature-div-actions').hide();
    $('#f1_upload_form').show();
    var data = $('#signature-div').jSignature('getData', 'default');
    $('#f1_upload_form input[name="myfile_base64"]').val( data.substring(data.indexOf(',')+1) );
    $('form#form_file_upload').submit();
}

function startUpload(){
    // If didn't select a file, give an error msg
    var isSignature = ($('#f1_upload_form input[name="myfile_base64"]').val().length > 0);
    var missingFile = (!isSignature && $('#f1_upload_form input[name="myfile"]').val().length + $('#f1_upload_form input[name="myfile_base64"]').val().length == 0);
    if (!isSignature && missingFile) {
        simpleDialog("You must first choose a file to upload","ERROR",null,300);
        return false;
    } else {
        document.getElementById('f1_upload_process').style.display = 'block';
        document.getElementById('f1_upload_form').style.display = 'none';
        return true;
    }
}

// Truncate a file name to X characters while still maintaining the file extension
function truncate_filename(filename, charLimit, truncateMarkFromEnd)
{
    if (typeof truncateMarkFromEnd == 'undefined') truncateMarkFromEnd = 9;
    var origLength = filename.length;
    if (origLength > charLimit) {
        filename = trim(filename.substr(0, charLimit - truncateMarkFromEnd))+"..."+trim(filename.substr(origLength - truncateMarkFromEnd));
    }
    return filename;
}

//For individual field File uploads
function filePopUp(field_name, signature, replace_version) {
    // Reset value of hidden field used to determine if signature was signed
    $('#f1_upload_form input[name="myfile_base64_edited"]').val('0');
    $('#f1_upload_form input[name="myfile_replace"]').val(replace_version);
    // Set dialog content, etc.
    document.getElementById('file_upload').innerHTML = file_upload_win;
    document.getElementById('field_name').value = field_name+'-linknew';
    // Dialog
    var label = $('#label-'+field_name).clone();
    label.find('.requiredlabel').remove();
    label.find('#MDMenu').remove();
    $("#field_name_popup").html(trim(label.text()));
    var dlgtitle = (signature == 1 ? lang_file_upload_title2 : (replace_version == 1 ? lang_file_upload_title3 : lang_file_upload_title1));
    $('#file_upload').dialog({ title: dlgtitle, bgiframe: true, modal: true, width: (isMobileDevice ? $('#questiontable').width() : 500) });
    // Signature?
    if (signature == 1) {
        $('#signature-div, #signature-div-actions').show();
        $('#f1_upload_form').hide();
        $('#signature-div').jSignature();
    } else {
        $('#signature-div, #signature-div-actions').hide();
        // Since iOS (v5.1 and below) devices do not support file uploading on webpages in Mobile Safari, give note to user about this.
        if (isIOS && iOSv <= 5) {
            $('#this_upload_field').hide();
            $('#f1_upload_form').html("<p style='color:red;'><b>CANNOT UPLOAD FILE!</b><br>"
                + "We're sorry, but Apple does not support uploading files onto web pages "
                + "in their Mobile Safari browser for iOS devices (iPhones, iPads, and iPod Touches) that "
                + "are running iOS version 5.1 and below. "
                + "Because it appears that you are using an iOS device on such an older version, you will not be able to upload a file here."
                + "This is not an issue in REDCap but is merely a limitation imposed by Apple. NOTE: iOS version 6 and above *does* support uploading "
                + "of pictures and videos (but not other file types).</p>");
        } else {
            $('#f1_upload_form').show();
        }
    }
    // In case any unsaved data from the form needs to be piped into the label in the dialog, manually trigger onblur for the field(s)
    $('#file_upload .piping_receiver').each(function(){
        // Get class that begins with "piperec"
        var classList = $(this).attr('class').split(/\s+/);
        for (var i = 0; i < classList.length; i++) {
            classList[i] = trim(classList[i]);
            if (classList[i].indexOf('piperec') === 0) {
                var evtRec = classList[i].split('-');
                // If the event_id is the current event_id of this form
                if (evtRec[1] == event_id) {
                    // Trigger onblur/change/click of the field (cover all the bases, even radio elements)
                    if ($('form#form [name="'+evtRec[2]+'___radio"]').length) {
                        $('form#form [name="'+evtRec[2]+'___radio"]:checked').trigger('click');
                    } else if ($('form#form [name="'+evtRec[2]+'"]').prop("tagName").toLowerCase() == 'select') {
                        $('form#form [name="'+evtRec[2]+'"] option:selected').trigger('change');
                    } else {
                        $('form#form [name="'+evtRec[2]+'"]').trigger('blur');
                    }
                }
            }
        }
    });
}

//For unchecking radio buttons
function uncheckRadioGroup (radioButtonOrGroup) {
    if (radioButtonOrGroup.length) { // we have a group
        for (var b = 0; b < radioButtonOrGroup.length; b++)
            if (radioButtonOrGroup[b].checked) {
                radioButtonOrGroup[b].checked = false;
                break;
            }
    }
    else
        try{radioButtonOrGroup.checked = false}catch(err){};
}

// Append hidden input to Data Entry Form (i.e. form#form)
function appendHiddenInputToForm(name,val) {
    $('form#form').append('<input type="hidden" value="'+val+'" name="'+name+'">');
}

// Enable green row highlight for data entry form table
function enableDataEntryRowHighlight() {
    $('form#form #questiontable :input, form#form #questiontable a')
        .bind('click focus select', function(event){
            // If save buttons are not displayed (e.g., form is locked), then don't highlight row
            if ($('#__SUBMITBUTTONS__-div').css('display') == 'none') return;
            // Exclude if clicked the Data History and balloon icons for this field
            if ($(this).has('img').length) return;
            // Obtain type of html tag source that triggered this event
            var targetTag = event.target.nodeName.toLowerCase();
            // Exclude "reset" links for radios (unless directly clicked)
            if ($(this).hasClass('cclink') && event.type != 'click') return;
            // Exclude text input, textarea, and drop-down click because it would have already been triggered by focus
            if (event.type == 'click' && (targetTag == 'textarea' || targetTag == 'select'
                || (targetTag == 'input' && $(event.target).attr('type') == 'text'))) return;
            // Skip over calc fields
            if (targetTag == 'input' && $(event.target).attr('type') == 'text' && $(event.target).attr('readonly') == 'readonly') return;
            // Find row element
            var tr = $(this).closest('tr');
            // Go up one or two levels if table nested within table
            if (tr.attr('sq_id') == null) tr = tr.parent().closest('tr');
            if (tr.attr('sq_id') == null) tr = tr.parent().closest('tr');
            // If could not find the row element, then stop
            if (tr.attr('sq_id') == null || tr.attr('id') == null || tr.attr('id').indexOf('-sh-tr') > -1) return;
            // Do green highlight on row
            doGreenHighlight(tr);
            // Add custom "Save and Open Query Popup" button
            if (data_resolution_enabled == '2') {
                var hasExclRedIcon = (tr.html().indexOf('balloon_exclamation.gif') > -1);
                var hasExclBlueIcon = (tr.html().indexOf('balloon_exclamation_blue.gif') > -1);
                if (hasExclRedIcon || hasExclBlueIcon) {
                    // Get field name
                    var fieldname = tr.attr('id').replace('-tr','');
                    // Add content to tooltip
                    $('#tooltipDRWsave').html( '<div style="padding:12px 0 0 8px;overflow:hidden;">'+
                        '<button name="submit-btn-saverecord" class="jqbuttonmed" onclick="appendHiddenInputToForm(\'scroll-top\',\''+($(window).scrollTop())+'\');appendHiddenInputToForm(\'dqres-fld\',\''+fieldname+'\');dataEntrySubmit(this);return false;">'+
                        '<img src="'+app_path_images+'balloon_exclamation'+(hasExclBlueIcon ? '_blue' : '')+'.gif"> Save and then open <br>Data Resolution Pop-up</button>'+
                        '</div>');
                    // Buttonize the Save&Open Popup button
                    $('#tooltipDRWsave button').button();
                    // Open tooltip	to right of field
                    $('#tooltipDRWsave').show().position({
                        my:        "left center",
                        at:        "right+100 center",
                        of:        this
                    });
                } else {
                    $('#tooltipDRWsave').hide();
                }
            }
        });
}

// Highlight a form/survey table row with green background color
function doGreenHighlight(rowob) {
    // Reset bgcolor for all rows in case others are highlighted
    $('form#form #questiontable tr td.greenhighlight').removeClass('greenhighlight');
    // If found the row element, highlight all cells
    rowob.children("td").each(function() {
        $(this).addClass('greenhighlight');
        if ($(this).hasClass('labelmatrix')) {
            $(this).find('table tr td.data_matrix, table.mtxchoicetablechk tr td.data, table.mtxchoicetable tr td.data')
                .addClass('greenhighlight');
        }
    });
}

// Run when click the "reset value" for radio button fields
function radioResetVal(field,form) {
    // Put everything inside a timeout due to issues with embedded radio fields
    setTimeout(function(){
        $('form[name="'+form+'"] input[name="'+field+'___radio"]').prop('checked',false);
        $('form[name="'+form+'"] input[name="'+field+'"]').val('');
        if (form == 'form') {
            // If using Enhanced Choices for radios, then deselect it
            if ($('.rc-field-embed[var="'+field+'"]').length) {
                $('.rc-field-embed[var="'+field+'"] div.enhancedchoice label.selectedradio').removeClass('selectedradio');
            } else {
                $('#'+field+'-tr div.enhancedchoice label.selectedradio').removeClass('selectedradio');
            }
            // Piping: Transmit blank value to all piping receiver spans
            if (event_id != null) {
                $('.piping_receiver.piperec-'+event_id+'-'+field+', .piping_receiver.piperec-'+event_id+'-'+field+'-label, .piping_receiver.piperec-'+event_id+'-'+field+'-value').html('______');
                // Update drop-down options separately via ajax
                try{ updatePipingDropdowns(field,''); } catch(e) { }
            }
            dataEntryFormValuesChanged = true;
            // Branching logic and calculations
            try { calculate(field);doBranching(field); } catch(e){ }
        }
    },10);
    return false;
}

// Check if value is unique
function checkSecondaryUniqueField(ob)
{
    var instance = getParameterByName('instance');
    if (instance == '') instance = '1';
    // Disable all form buttons temporarily
    $('#formSaveTip input[type="button"], #form input[type="button"], #form :input[name="'+secondary_pk+'"]').prop('disabled', true);
    // Init values
    var url_base = 'DataEntry/check_unique_ajax.php';
    if (page == 'surveys/index.php') {
        // Survey page
        var record = ((document.form.__response_hash__.value == '') ? '' : $('#form :input[name="'+table_pk+'"]').val());
        var url = app_path_webroot_full+page+'?s='+getParameterByName('s')+'&__passthru='+encodeURIComponent(url_base);
    } else {
        // Data entry page
        var record = ((document.form.hidden_edit_flag.value == '0') ? '' : getParameterByName('id'));
        var url = app_path_webroot+url_base+'?page='+getParameterByName('page');
    }
    ob.val( trim(ob.val()) );
    if (ob.val().length > 0) {
        // Make ajax request
        $.ajax({
            url: url,
            type: 'GET',
            data: { pid: pid, field_name: secondary_pk, event_id: event_id, record: record, instance: instance, value: ob.val() },
            async: false,
            success:
                function(data){
                    if (data.length == 0) {
                        alert(woops);
                        setTimeout(function () { ob.focus() }, 1);
                    } else if (data != '0') {
                        if (page == 'surveys/index.php') {
                            simpleDialog(lang.data_entry_169+' ("'+ob.val()
                                + '") '+lang.data_entry_170+' '+lang.data_entry_108, lang.data_entry_105, 'suf_warning_dialog',500,"$('#form :input[name="+secondary_pk+"]').focus();", lang.calendar_popup_01);
                        } else {
                            simpleDialog(lang.data_entry_106+' ('+secondary_pk
                                + ')'+lang.data_entry_107+' '+lang.data_entry_109+' '+lang.data_entry_110+' ' + lang.data_entry_111+' ("'+ob.val()
                                + '")'+lang.period+' '+lang.data_entry_108, lang.data_entry_105, 'suf_warning_dialog',500,"$('#form :input[name="+secondary_pk+"]').focus();", lang.calendar_popup_01);
                        }
                        ob.css('font-weight','bold');
                        ob.css('background-color','#FFB7BE');
                        // If this is a DDP project and the DDP "preview data" dialog is displayed, close it
                        if ($('#rtws_idfield_new_record_warning').length && $('#rtws_idfield_new_record_warning').hasClass('ui-dialog-content')) {
                            $('#rtws_idfield_new_record_warning').dialog('close');
                        }
                    } else {
                        ob.css('font-weight','normal');
                        ob.css('background-color','#FFFFFF');
                    }
                    // Enable all form buttons again
                    $('#formSaveTip input[type="button"], #form input[type="button"], #form :input[name="'+secondary_pk+'"]').prop('disabled', false);
                }
        });
    } else {
        // Enable all form buttons again
        $('#formSaveTip input[type="button"], #form input[type="button"], #form :input[name="'+secondary_pk+'"]').prop('disabled', false);
    }
}