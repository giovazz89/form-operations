(function( $ ) {

	// SYNTAX: 	$('result_selector').operation('{element(s)_selector_1} + ({element(s)_selector_2} * {element(s)_selector_3})');
	//			$('result_selector').operation('1 * {multiple_elements_selector}');
	//			$('result_selector').operation('{multiple_elements_selector} * 1');
	//			$('result_selector').operation('0 + {multiple_elements_selector}');

    $.fn.operation = function(options) {

    	// initial settings
	    var defaults = {
	    	'query': null,
	    	'events': ['change'],				// array of events that trigger recalculation (event on query elements) - RE_SPECIFY 'change' IF YOU PASS THIS PARAMETER
	    	'checkNew': false,					// if set to true checks for fields inserted in the DOM afterwards initialization
	    	'timedCheck': 0,					// check changes every specified milliseconds (n <= 0 is disabled) - CAN SLOW DOWN THE PAGE
	    	'fieldsDecimalSeparator': '.',		// decimal separator used in the input fields
	    	'fieldsThousandSeparator': '',		// thousand separator used in the input fields
	    	'resultDecimalSeparator': '.',		// decimal separator used in the result field
	    	'resultThousandSeparator': '',		// thousand separator used in the result field
	    	'decimalDigits': -1					// to fix the number of decimal digits in the result input a number 0 <= n <= 20
	    };
	    var element = this;
        if(options != undefined && typeof options === 'string') options = {'query': options};


        // check query
    	if(options['query'] == null || options['query'].replace(/[{}\s]/g, '').length == 0){
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

        // check separators
        if(settings['fieldsDecimalSeparator'] == settings['fieldsThousandSeparator']){
        	throw 'Thousand and decimal fields separator must differ';
        	return;
        }
        if(settings['resultDecimalSeparator'] == settings['resultThousandSeparator']){
        	throw 'Thousand and decimal result separator must differ';
        	return;
        }
        if(settings['resultDecimalSeparator'].trim() == '' || settings['fieldsDecimalSeparator'].trim() == ''){
        	throw 'Decimal separator cannot be empty';
        	return;
        }

        // escape fields separators
        if(settings['fieldsDecimalSeparator'] == '.')
        	settings['fieldsDecimalSeparator'] = '/.';
        if(settings['fieldsThousandSeparator'] == '.')
        	settings['fieldsThousandSeparator'] = '/.';




        // search elements to add listeners
        var start, end, selector, query = settings['query'];
		while(query.indexOf('{') >= 0){
    		// find the SELECTOR string
    		start = query.indexOf('{');
    		end = query.indexOf('}');
    		selector = query.substring(start + 1, end).trim();

    		for(var i in settings['events']){
                	if(typeof settings['events'][i] != 'string') continue;
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
			while(longEnd < query.length && query.charAt(longEnd) == ' ') longEnd++;
	    	if(longEnd >= query.length) longEnd = end;

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
	    	query = query.substring(0, longStart) + query.substring(longEnd + 1, query.length);

	    	// generate substitutive code
	    	$(selector).each(function(){
	    		query = query.splice(longStart, 0, toRemove.substring(0, start) + fromDisplayFormat(getFieldValue($(this)), settings) + toRemove.substring(end + 1, toRemove.length));
	    	});
    	}

    	// creates a FUNCTION FROM the calculated QUERY
    	var exec = new Function('return ' + query + ';');
        var val = exec();

        val = toDisplayFormat(val, settings);

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
    	return val + '';
    }

    // manage display formats
    function toDisplayFormat(val, settings){
    	var newVal = val;
    	if(typeof newVal === 'string') newVal = parseFloat(newVal);
    	if(settings['decimalDigits'] >= 0 && settings['decimalDigits'] <= 20) newVal = newVal.toFixed(settings['decimalDigits']);
    	newVal = newVal + '';

    	var dec = settings['resultDecimalSeparator'];
    	if(newVal.split('.').length > 1) dec += newVal.split('.')[1];
    	else dec = '';

    	newVal = newVal.split('.')[0];
    	newVal = newVal.chunk(3, 1).join(settings['resultThousandSeparator']);
    	newVal += dec;

    	return newVal;
    }

    function fromDisplayFormat(val, settings){
		var t = new RegExp(settings['fieldsThousandSeparator'],'g');
		var d = new RegExp(settings['fieldsDecimalSeparator'],'g');
    	return val.replace(t, '').replace(d, '.');
    }
 
}( jQuery ));


// inserts string in other string after idx - 1 and returns result
String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

// chunks up a string in pieces of 'num' length in 'dir' direction (0 left to right, 1 right to left)
String.prototype.chunk = function(num, dir) {
    var ret = [];
    var len = this.length;
    var start = (len * dir) % num;
    if(start > 0) ret.push(this.substr(0, start));
    for(var i = start; i < len; i += num) {
       ret.push(this.substr(i, num));
    }
    return ret
};

/* =============================================== created by giovazzz89 - http://giovannimuzzolini.com ================================================ */
