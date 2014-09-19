(function( $ ) {

	// SYNTAX: 	$('result_selector').operation('{element(s)_selector_1} + ({element(s)_selector_2} * {element(s)_selector_3})');
	//			$('result_selector').operation('1 * {multiple_elements_selector}');
	//			$('result_selector').operation('{multiple_elements_selector} * 1');
	//			$('result_selector').operation('0 + {multiple_elements_selector}');

    $.fn.operation = function(options) {

    	// initial settings
	    var defaults = {
	    	'query': null,
	    	'events': ['change'],		// array of events that trigger recalculation (event on query elements) - RE_SPECIFY 'change' IF YOU PASS THIS PARAMETER
	    	'checkNew': false,			// if set to true checks for fields inserted in the DOM afterwards initialization
	    	'timedCheck': 0,			// check changes every specified milliseconds (n <= 0 is disabled) - CAN SLOW DOWN THE PAGE
	    };
	    var element = this;
        if(options != undefined && typeof options === 'string') options = {'query': options};


        // check query
    	if(options['query'] == null || options['query'].replace(/{/g, '').replace(/}/g, '').trim() == ''){
    		throw 'Your query is empty!';
    		return;
		}
        // check {} sintax
        if((options['query'].match(new RegExp('{', 'g')) || []).length != (options['query'].match(new RegExp('}', 'g')) || []).length){
        	throw 'You have an error in your {} syntax';
        	return;
        }

        // extend default settings
        var settings = $.extend({}, defaults, options);

        console.log(settings);

        // search elements to add listeners
        var start, end, selector, query = settings['query'];
		while(query.indexOf('{') >= 0){
    		// find the SELECTOR string
    		start = query.indexOf('{');
    		end = query.indexOf('}');
    		selector = query.substring(start + 1, end).trim();

    		for(var i in settings['events']){
	        	if(settings['checkNew']) $(document).on(settings['events'][i], selector, function(){ calculate(element, settings); });
	    		else $(selector).on(settings['events'][i], function(){ calculate(element, settings); });
    		}

    		query = query.replace('{', ''); query = query.replace('}', '');
		}

		// execute first calculation
        calculate(element, settings);
        if(settings['timedCheck'] > 0) setInterval(function(){ calculate(element, settings); }, settings['timedCheck']);
 
        return this;
    };

    // calculates the value of the inserted QUERY replacing the selectors with their values
    function calculate(res, settings){
    	var query = settings['query'];
    	var selector, start, end, longStart, longEnd, pre, post, toRemove;

    	// replace every selector with values
    	while(query.indexOf('{') >= 0){
    		// find the SELECTOR string
    		start = query.indexOf('{');
    		end = query.indexOf('}');
    		selector = query.substring(start + 1, end).trim();

    		// find associated symbol
	    	longStart = start - 1;
	    	longEnd = end + 1;
	    	while(longStart >= 0 && query.charAt(longStart) == ' ') longStart--;
	    	if(longStart < 0) longStart = start;
			while(longEnd < query.lenght && query.charAt(longEnd) == ' ') longEnd++;
	    	if(longEnd >= query.lenght) longEnd = end;

	    	pre = query.charAt(longStart);
	    	post = query.charAt(longEnd);
	    	if(pre == '*' || pre == '/') longEnd = end;
	    	if(post == '*' || post == '/') longStart = start;
	    	if(pre == '+' || pre == '-') longEnd = end;
	    	if(post == '*' || post == '/') longStart = start;

	    	if(pre != '*' && pre != '/' && pre != '+' && pre != '-') longStart = start;
	    	if(post != '*' && post != '/' && post != '+' && post != '-') longEnd = end;

	    	// remove the PART from the QUERY
	    	toRemove = query.substring(longStart, longEnd + 1);
	    	start = start - longStart;
	    	end = end - longStart;
	    	query = query.substring(0, longStart) + query.substring(longEnd + 1, query.lenght);

	    	// generate substitutive code
	    	$(selector).each(function(){
	    		query = query.splice(longStart, 0, toRemove.substring(0, start) + getFieldValue($(this)) + toRemove.substring(end + 1, toRemove.lenght));
	    	});
    	}

    	// creates a FUNCTION FROM the calculated QUERY
    	var exec = new Function('return ' + query + ';');
        var val = exec();

        // SET the VALUE IN the RESULT field
    	setFieldValue(res, val);
    }

    // set value of the html element for INPUT or OTHER
    function setFieldValue(el, val){
    	if(el[0].tagName == 'INPUT') el.val(val);
    	else el.html(val);

    	el.change();
    	return el;
    }

    // get value of the html element for INPUT or OTHER
    function getFieldValue(el){
    	var val;
    	if(el[0].tagName == 'INPUT') val = el.val();
    	else return val = el.html();

    	if(val.trim() == '') val = 0;
    	return val;
    }
 
}( jQuery ));


// inserts string in other string after idx - 1 and returns result
String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};