# nw-context

Store browser `document` and `window` objects in a module for later retrieval from node-webkit modules running in the node context.

Set up in the browser:

	var context = require('nw-context');
	context.set({
		window: window,
		document: document
	});

Then from within other modules:

	var window = require('nw-context').window,
		document = require('nw-context').document;
