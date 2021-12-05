
// thank you
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript

// query string: ?foo=lorem&bar=&baz
// var foo = getParameterByName('foo'); // "lorem"
// var bar = getParameterByName('bar'); // "" (present with empty value)
// var baz = getParameterByName('baz'); // "" (present with no value)
// var qux = getParameterByName('qux'); // null (absent)
//

function getParameterByName(name, url = window.location.href) {
	    name = name.replace(/[\[\]]/g, '\\$&');
	    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}


