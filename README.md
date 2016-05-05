form-operations
===============

JQuery plugin to manage operations between fields and/or html elements

<h3>usage</h3>

<pre><code>$('result_field_selector').operation('query_string');</code></pre>

OR

<pre><code>options = {query: 'your query'};
$('result_field_selector').operation(options);</code></pre>


It can be used on HTML elements other than INPUT too!


<h3>options</h3>

<table><thead><tr><th>Option</th><th>Default</th><th>Input</th></tr></thead><tbody>
<tr><td>query</td><td>-</td><td>Mathematical expression with jquery selectors between {} ('1 + {#my-field}')</td></tr>
<tr><td>events</td><td>['change']</td><td>array of events that trigger recalculation (event on query elements)</td></tr>
<tr><td>checkNew</td><td>false</td><td>if set to true checks for fields inserted in the DOM after initialization</td></tr>
<tr><td>timedCheck</td><td>0</td><td>check changes every specified milliseconds (n <= 0 is disabled)</td></tr>
<tr><td>fieldsDecimalSeparator</td><td>'.'</td><td>decimal separator used in the input fields</td></tr>
<tr><td>fieldsThousandSeparator</td><td>''</td><td>thousand separator used in the input fields</td></tr>
<tr><td>resultDecimalSeparator</td><td>'.'</td><td>decimal separator used in the result field</td></tr>
<tr><td>resultThousandSeparator</td><td>''</td><td>thousand separator used in the result field</td></tr>
<tr><td>decimalDigits</td><td>-1</td><td>to fix the number of decimal digits in the result input a number 0 <= n <= 20</td></tr>
</tbody></table>

<h3>multiple fields selector</h3>

If a selector has been used for multiple fileds ('{.myfields}' or others) it calculates all their values (prioritizing multiplications and divisions)

EXAMPLE

<pre><code>$('#result selector').operation('... - 1 + {.myfields} * 5 ...');</code>

//it will become:
<code>('... - 1 + {myfields 1 value} * {myfields 2 value} * ... * 5);</code></pre>

IF YOU WANT THAT TO BE A SUM

<pre><code>$('#result selector').operation('... - (1 + {.myfields}) * 5 ...');</code> //...add parenthesis!! ;)</pre>
