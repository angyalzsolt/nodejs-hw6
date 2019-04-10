/*
*
* Request handlers
*
*
*/

// Define the handlers
let handlers = {};

handlers.notFound = (data, callback)=>{
	let msg = {'Error': 'Page not found'};
	callback(404, msg);
};

handlers.hello = (data, callback)=>{
	let msg = {'Welcome': 'Hey, nice to meet you!'};
	callback(200, msg);
};

module.exports = handlers;