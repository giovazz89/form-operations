form-operations
===============

JQuery plugin to manage operations between fields and/or html elements

<h1>usage</h1>

$('result_field_selector').('query_string');

OR

options = {query: 'your query'};
$('result_field_selector').(options);


It can be used on HTML elements other than INPUT too!


<h1>options</h1>

<table><thead><tr><th>Option</th><th>Default</th><th>Input</th></tr></thead><tbody>
<tr><td>query</td><td>null</td><td>Mathematical expression with jquery selectors between {} ('1 + {#my-field}')</td></tr>
<tr><td>events</td><td>['change']</td><td>array of events that trigger recalculation (event on query elements)</td></tr>
<tr><td>checkNew</td><td>false</td><td>if set to true checks for fields inserted in the DOM afterwards initialization</td></tr>
<tr><td>timedCheck</td><td>0</td><td>check changes every specified milliseconds (n <= 0 is disabled)</td></tr>
<tr><td>fieldsDecimalSeparator</td><td>'.'</td><td>decimal separator used in the input fields</td></tr>
<tr><td>fieldsThousandSeparator</td><td>''</td><td>thousand separator used in the input fields</td></tr>
<tr><td>resultDecimalSeparator</td><td>'.'</td><td>decimal separator used in the result field</td></tr>
<tr><td>resultThousandSeparator</td><td>''</td><td>thousand separator used in the result field</td></tr>
<tr><td>decimalDigits</td><td>-1</td><td>to fix the number of decimal digits in the result input a number 0 <= n <= 20</td></tr>
</tbody></table>
