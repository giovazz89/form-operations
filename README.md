form-operations
===============

JQuery plugin to manage operations between fields and/or html elements

=================== USAGE ===================

$('result_field_selector').('query_string');

OR

$('result_field_selector').(options);


=================== OPTIONS ===================

options = {
        'query': null,
	    	'events': ['change'],				// array of events that trigger recalculation (event on query elements) - RE_SPECIFY 'change' IF YOU PASS THIS PARAMETER
	    	'checkNew': false,					// if set to true checks for fields inserted in the DOM afterwards initialization
	    	'timedCheck': 0,					// check changes every specified milliseconds (n <= 0 is disabled) - CAN SLOW DOWN THE PAGE
	    	'fieldsDecimalSeparator': '.',		// decimal separator used in the input fields
	    	'fieldsThousandSeparator': '',		// thousand separator used in the input fields
	    	'resultDecimalSeparator': '.',		// decimal separator used in the result field
	    	'resultThousandSeparator': '',		// thousand separator used in the result field
	    	'decimalDigits': -1					// to fix the number of decimal digits in the result input a number 0 <= n <= 20
	    
}
