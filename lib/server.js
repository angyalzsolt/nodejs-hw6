/*
*
*
* Server-related tasks
*
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const path = require('path');
const handlers = require('./handlers');


// Instantiate the server module object
const server = {};

// Instantiate the Http server
server.httpServer = http.createServer((req, res)=>{
	server.unifiedServer(req, res);
});


// Instantiate the Https server
server.httpsServerOptions = {
	'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
	'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};
server.httpsServer = https.createServer(server.httpsServerOptions, (req, res)=>{
	server.unifiedServer(req, res);
});

// All the server logic for both the https and https server
server.unifiedServer = (req, res)=>{
	// Get the url and parse it
	const parsedUrl = url.parse(req.url, true);

	// Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	const queryStringObject = parsedUrl.query;

	// Get the https method
	const method = req.method.toUpperCase();

	// Get the headers as an object
	const headers = req.headers;

	// Get the payload, if any
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	req.on('data', (data)=>{
		buffer += decoder.write(data);
	});
	req.on('end', ()=>{
		buffer += decoder.end();

		// Choose the handler this request should go. If one is not found, use the notFound handler
		let chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

		// Construct the data object to send to the handler
		let data = {
			trimmedPath,
			queryStringObject,
			method,
			headers
		};

		chosenHandler(data, (statusCode, payload)=>{
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			payload = typeof(payload) === 'object' ? payload : {};
			const payloadString = JSON.stringify(payload);
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// If the response is 200, print green, otherwise print red
			if(statusCode === 200){
				console.log('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
			} else {
				console.log('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} /${trimmedPath} ${statusCode}`);
			}
		});
	});
}


// Define the request router
server.router = {
	'hello': handlers.hello
};

// Init the script
server.init = ()=>{
	// Start the https server
	server.httpServer.listen(config.httpPort, ()=>{
		console.log('\x1b[36m%s\x1b[0m', `The server is started on port ${config.httpPort} in ${config.envname} mode now`);
	});

	// Start the https server
	server.httpsServer.listen(config.httpsPort, ()=>{
		console.log('\x1b[35m%s\x1b[0m',`The server is started on port ${config.httpsPort} in ${config.envname} mode now`);
	});
}

// Export the server
module.exports = server;





