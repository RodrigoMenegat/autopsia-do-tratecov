// $('#some-element').actual('height'); to obtain sizes of hidden elements on page
/*! Copyright 2012, Ben Lin (http://dreamerslab.com/)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Version: 1.0.19
 *
 * Requires: jQuery >= 1.2.3
 */
(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a);
}else{a(jQuery);}}(function(a){a.fn.addBack=a.fn.addBack||a.fn.andSelf;a.fn.extend({actual:function(b,l){if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';
}var f={absolute:false,clone:false,includeMargin:false,display:"block"};var i=a.extend(f,l);var e=this.eq(0);var h,j;if(i.clone===true){h=function(){var m="position: absolute !important; top: -1000 !important; ";
e=e.clone().attr("style",m).appendTo("body");};j=function(){e.remove();};}else{var g=[];var d="";var c;h=function(){c=e.parents().addBack().filter(":hidden");
d+="visibility: hidden !important; display: "+i.display+" !important; ";if(i.absolute===true){d+="position: absolute !important; ";}c.each(function(){var m=a(this);
var n=m.attr("style");g.push(n);m.attr("style",n?n+";"+d:d);});};j=function(){c.each(function(m){var o=a(this);var n=g[m];if(n===undefined){o.removeAttr("style");
}else{o.attr("style",n);}});};}h();var k=/(outer)/.test(b)?e[b](i.includeMargin):e[b]();j();return k;}});}));

// Change font size of elements on page. Provide tags (e.g., p, .data) and increase factor (e.g., 0.8, 1.5) and class to exclude (e.g., label)
function changeFont(tags, factor) {
	var matrixRegex = /matrix\((-?\d*\.?\d+),\s*0,\s*0,\s*(-?\d*\.?\d+),\s*0,\s*0\)/;
	factor = (factor > 1) ? 2.0 : -2.0;

	// Tags are iterated in reverse to prevent compounding size changes in nested spans
	// due to incorrect detection of the previous size as the size set during the
	// current iteration of this method.
	$($(tags).get().reverse()).each(function(){
		// Get font-size and increase
		var ob = $(this);
		// For certain fields, get height and increase
		var tag_name = this.tagName.toLowerCase();
		// Skip spans that wrap drop-downs
		if (tag_name == 'span' && $('select:first-child',ob).hasClass('x-form-text')) return;
		// Set font-size
		var appendStyle = 'font-size: '+(parseFloat(ob.css('font-size'),10)+factor)+'px !important;';
		// Set based on input type
		if (tag_name == 'select') {
			// Drop-down
			var thisHeight = parseFloat(ob.css('height'),10);
			if (thisHeight < 5) thisHeight = ob.actual('height'); // Use alternative method to find height of hidden element
			appendStyle += 'height: '+(thisHeight+factor)+'px !important;';
		} else if (tag_name == 'input') {
			var input_type = ob.attr('type');
			if (input_type == 'text') {
				// Text
				var thisHeight = parseFloat(ob.css('height'),10);
				if (thisHeight < 5) thisHeight = ob.actual('height'); // Use alternative method to find height of hidden element
				appendStyle += 'height: '+(thisHeight+factor)+'px !important;';
			} else if (input_type == 'radio' || input_type == 'checkbox') {
				// Radio/Checkbox
				var transform = (ob.css('-webkit-transform') != null ? ob.css('-webkit-transform') : (ob.css('-moz-transform') != null ? ob.css('-moz-transform') : (ob.css('-ms-transform') != null ? ob.css('-ms-transform') : (ob.css('transform') != null ? ob.css('transform') : (ob.css('-o-transform') != null ? ob.css('-o-transform') : 1)))));
				if (transform !== 1) {
					try {
						var matches = transform.match(matrixRegex);
						transform = matches[1]*1+(factor/10);
					} catch(e) {
						transform = 1+(factor/10);
					}
				} else {
					transform = 1+(factor/10);
				}
				ob.css({
					'-webkit-transform' : 'scale(' + transform + ')',
					'-moz-transform'    : 'scale(' + transform + ')',
					'-ms-transform'     : 'scale(' + transform + ')',
					'-o-transform'      : 'scale(' + transform + ')',
					'transform'         : 'scale(' + transform + ')'
				});
				var margin = round(ob.css('margin-top').replace('px','')*1+factor);
				appendStyle += 'margin: '+margin+'px '+margin+'px '+margin+'px 0px !important;';
			}
		} else if (tag_name == 'button' && ob.hasClass('rc-autocomplete')) {
			// Drop-down autocomplete button
			appendStyle += 'height: '+($('input.rc-autocomplete:first', ob.parent()).outerHeight())+'px !important;';
		}
		var style = (ob.attr('style') == null) ? '' : ob.attr('style');
		ob.attr('style', style+';'+appendStyle);
	});
}

$(function()
{
	// Set original font increment and tags to change
	var fontSizeCookie = getCookie('fontsize');
	var fontIncreaseIncrement = (fontSizeCookie != null && fontSizeCookie != "" && fontSizeCookie != 0) ? fontSizeCookie : 0;
	var fontIncreaseTags = 'a, p, h3, span, select, input, textarea, .note, .labelrc, .data, .labelmatrix, .data_matrix,.headermatrix td, #surveytitle, .header, .sliderlabels td, '
						 + '.sldrmsg, #surveyinstructions p, .popup-contents td, #return_instructions, .exittext, button.rc-autocomplete, .choicevert, choicehoriz';
	// Increase Font Size
	$('.increaseFont').click(function(){
		changeFont(fontIncreaseTags, 1.2);
		// Increase global value of font
		fontIncreaseIncrement++;
		// Set cookie
		setCookie('fontsize',fontIncreaseIncrement,1);
	});
	// Decrease Font Size
	$('.decreaseFont').click(function(){
		changeFont(fontIncreaseTags, 1/1.2);
		// Decrease global value of font
		fontIncreaseIncrement--;
		// Set cookie
		setCookie('fontsize',fontIncreaseIncrement,1);
	});
	// If cookie is already set for font size change, then resize again at page load
	if (fontIncreaseIncrement != 0) {
		if (fontIncreaseIncrement > 0) {
			for (i=1; i <= fontIncreaseIncrement; i++) {
				changeFont(fontIncreaseTags, 1.2);
			}
		} else {
			for (i=1; i <= Math.abs(fontIncreaseIncrement); i++) {
				changeFont(fontIncreaseTags, 1/1.2);
			}
		}
	}
});